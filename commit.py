#!/usr/bin/env python

from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional

REPO_ROOT = Path(__file__).parent
FRONTEND_DIR = REPO_ROOT / "frontend"
PACKAGE_JSON = FRONTEND_DIR / "package.json"
DOCKER_COMPOSE_FILE = FRONTEND_DIR / "docker-compose.local.yml"


class CommandError(Exception):
    """Raised when a command execution fails."""

    def __init__(self, command: List[str], message: str):
        self.command = command
        self.message = message
        super().__init__(f"Command {' '.join(command)} failed: {message}")


def run_command(
    command: List[str],
    *,
    cwd: Optional[Path] = None,
    check: bool = True,
    capture_output: bool = True,
    input_text: Optional[str] = None,
) -> Optional[List[str]]:
    """Run a shell command and return stdout as a list of lines."""
    try:
        result = subprocess.run(
            command,
            cwd=cwd,
            input=input_text,
            capture_output=capture_output,
            text=True,
            encoding="utf-8",
            check=False,
        )

        if result.returncode != 0 and check:
            error_msg = (
                result.stderr or result.stdout or ""
            ).strip() or "Unknown error"
            raise CommandError(command, error_msg)

        if capture_output:
            return result.stdout.strip().splitlines() if result.stdout else []

        return None

    except FileNotFoundError:
        print(f"Error: Command '{command[0]}' not found.")
        print("Ensure required tools are installed and in your PATH.")
        sys.exit(1)


def check_in_git_repo() -> bool:
    """Return True if we are inside a git repo."""
    try:
        run_command(["git", "rev-parse", "--is-inside-work-tree"])
        return True
    except CommandError:
        return False


def check_tools_installed() -> bool:
    """Check for required CLI tools."""
    required = ["git", "npm"]
    optional = ["node"]

    all_available = True

    for tool in required:
        try:
            run_command([tool, "--version"])
        except SystemExit:
            all_available = False
        except CommandError:
            print(f"Error: Required tool '{tool}' is not installed.")
            all_available = False

    for tool in optional:
        try:
            run_command([tool, "--version"])
        except (SystemExit, CommandError):
            print(f"Warning: Optional tool '{tool}' is not installed.")
            print("  Install Node.js 24+ so npm scripts run reliably.")

    return all_available


def check_codex_installed() -> bool:
    """Return True if Codex CLI is available."""
    if shutil.which("codex") is None:
        print("Codex CLI not found. Will ask for a manual commit message.")
    return False


def check_docker_available() -> bool:
    if shutil.which("docker") is None:
        return False
    try:
        run_command(["docker", "compose", "version"])
    except CommandError:
        return False
    return DOCKER_COMPOSE_FILE.exists()


def ensure_docker_up() -> bool:
    try:
        run_command(
            [
                "docker",
                "compose",
                "-f",
                str(DOCKER_COMPOSE_FILE),
                "up",
                "-d",
                "--remove-orphans",
            ],
            cwd=FRONTEND_DIR,
        )
        return True
    except CommandError as e:
        print(f"docker compose up failed: {e.message}")
        return False


def run_in_docker_npm(script: str) -> bool:
    try:
        output = run_command(
            [
                "docker",
                "compose",
                "-f",
                str(DOCKER_COMPOSE_FILE),
                "exec",
                "frontend",
                "npm",
                "run",
                script,
            ],
            cwd=FRONTEND_DIR,
        )
        if output:
            print("\n".join(output))
        print(f"{script}: completed.")
        return True
    except CommandError as e:
        print(f"{script} failed in docker: {e.message}")
        return False

    try:
        run_command(["codex", "--version"])
        return True
    except CommandError as exc:
        print(
            f"Codex CLI not working ({exc.message}). "
            "Will ask for a manual commit message."
        )
        return False


def load_npm_scripts() -> Dict[str, str]:
    """Load scripts from frontend/package.json."""
    if not PACKAGE_JSON.exists():
        print("Warning: frontend/package.json not found.")
        return {}

    try:
        data = json.loads(PACKAGE_JSON.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        print("Warning: Could not parse frontend/package.json.")
        return {}

    scripts = data.get("scripts", {}) or {}
    return {k: str(v) for k, v in scripts.items()}


def get_staged_files() -> List[str]:
    """Return list of staged files (any type)."""
    try:
        staged = run_command(["git", "diff", "--cached", "--name-only"])
        return [f for f in (staged or []) if Path(f).exists()]
    except CommandError as e:
        print(f"Error getting staged files: {e.message}")
        return []


def is_frontend_file(path_str: str) -> bool:
    """Heuristic to decide if a path is part of the frontend."""
    path = Path(path_str)
    frontend_exts = {
        ".svelte",
        ".ts",
        ".js",
        ".cjs",
        ".mjs",
        ".json",
        ".css",
        ".pcss",
        ".scss",
        ".md",
    }

    if path.parts and path.parts[0] == "frontend":
        return True

    return path.suffix.lower() in frontend_exts


def filter_frontend_files(files: List[str]) -> List[str]:
    return [f for f in files if is_frontend_file(f)]


def run_npm_script(script: str, scripts: Dict[str, str], label: str) -> bool:
    """Run an npm script if it exists."""
    if script not in scripts:
        print(f"Skipping {label}: no `{script}` script in package.json.")
        return True

    print(f"\nRunning `{script}` ({label})...")

    if check_docker_available():
        if not ensure_docker_up():
            return False
        return run_in_docker_npm(script)
    try:
        output = run_command(["npm", "run", script], cwd=FRONTEND_DIR)
        if output:
            print("\n".join(output))
        print(f"{script}: completed.")
        return True
    except CommandError as e:
        print(f"{script} failed: {e.message}")
        return False


def run_frontend_checks(
    scripts: Dict[str, str],
    frontend_files: List[str],
) -> bool:
    """Run available npm scripts when frontend files are staged."""
    if not frontend_files:
        print("\nNo staged frontend files detected. Skipping npm checks.")
        return True

    steps = [
        ("format", "formatting"),
        ("lint", "linting"),
        ("check", "type/svelte checks"),
        ("test", "tests"),
    ]

    for script, label in steps:
        if not run_npm_script(script, scripts, label):
            return False

    return True


def restage_files(files: List[str]) -> None:
    """git add the given files."""
    if not files:
        return
    print("\nRe-staging formatted frontend files...")
    try:
        run_command(["git", "add", *files], capture_output=False)
    except CommandError as e:
        print(f"Error re-staging files: {e.message}")


def has_staged_changes() -> bool:
    """Return True if there are any staged changes."""
    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        check=False,
    )
    return result.returncode == 1


def generate_commit_message_with_codex() -> Optional[str]:
    """Use Codex CLI on staged diff to generate a commit message."""
    print("\nGenerating commit message with Codex...")

    try:
        diff_lines = run_command(["git", "diff", "--cached"])
        diff_text = "\n".join(diff_lines or [])
    except CommandError as e:
        print(f"Error getting staged diff: {e.message}")
        return None

    if not diff_text.strip():
        print("No staged diff found. Nothing to commit.")
        return None

    prompt = (
        "Write a concise git commit subject line for these staged changes. "
        "Requirements:\n"
        "- Single line\n"
        "- Imperative mood (e.g., 'Add', 'Fix', 'Refactor')\n"
        "- Under 72 characters\n"
        "- No quotes\n"
        "- No extra explanation\n"
    )

    try:
        raw_output_lines = run_command(
            ["codex", "exec", prompt],
            input_text=diff_text,
        )
    except CommandError as e:
        print(f"Error calling Codex: {e.message}")
        return None

    if not raw_output_lines:
        print("Codex returned no output.")
        return None

    for line in raw_output_lines:
        stripped = line.strip()
        if not stripped:
            continue

        if stripped.startswith('"') and stripped.endswith('"'):
            stripped = stripped[1:-1].strip()
        if stripped.startswith("'") and stripped.endswith("'"):
            stripped = stripped[1:-1].strip()

        if stripped:
            print(f"Codex commit message: {stripped}")
            return stripped

    print("Could not extract a usable commit message from Codex output.")
    return None


def prompt_user_commit_message() -> Optional[str]:
    """Prompt the user to enter a commit message manually."""
    print("\nEnter a commit message (imperative mood, <72 chars recommended):")
    message = input("Commit message: ").strip()

    if not message:
        print("No commit message provided.")
        return None

    return message


def create_commit(message: str) -> bool:
    """Run `git commit -m "<message>"`."""
    print("\nCreating git commit...")
    try:
        run_command(["git", "commit", "-m", message], capture_output=False)
        print("✅ Commit created successfully.")
        return True
    except CommandError as e:
        print(f"Error creating commit: {e.message}")
        return False


def main() -> int:
    print("=" * 60)
    print("Frontend Checks & Codex Commit")
    print("=" * 60)

    if not check_in_git_repo():
        print("Error: This is not a git repository.")
        return 1

    if not FRONTEND_DIR.exists():
        print("Error: frontend/ directory is missing.")
        return 1

    if not check_tools_installed():
        print("\nPlease install missing required tools and try again.")
        return 1

    scripts = load_npm_scripts()

    staged_files = get_staged_files()
    if not staged_files:
        print("\nNo staged files. Stage some changes (git add ...) and rerun.")
        return 0

    frontend_files = filter_frontend_files(staged_files)
    print(f"\nStaged files: {len(staged_files)}")
    print(f"Staged frontend files: {len(frontend_files)}")

    all_ok = run_frontend_checks(scripts, frontend_files)

    if all_ok and frontend_files:
        restage_files(frontend_files)

    if not has_staged_changes():
        print("\nAfter formatting, there are no staged changes. Nothing to commit.")
        return 0

    if not all_ok:
        print("\nChecks failed. Fix issues and try again.")
        return 1

    codex_available = check_codex_installed()
    commit_msg: Optional[str] = None

    if codex_available:
        commit_msg = generate_commit_message_with_codex()
        if not commit_msg:
            print("\nFalling back to manual commit message entry.")
    else:
        print("\nCodex CLI unavailable. Please enter a commit message manually.")

    if not commit_msg:
        commit_msg = prompt_user_commit_message()

    if not commit_msg:
        print("\nFailed to obtain a commit message. Aborting commit.")
        return 1

    success = create_commit(commit_msg)
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
def check_docker_available() -> bool:
    if shutil.which("docker") is None:
        return False
    try:
        run_command(["docker", "compose", "version"])
    except CommandError:
        return False
    return DOCKER_COMPOSE_FILE.exists()

def ensure_docker_up() -> bool:
    try:
        run_command([
            "docker",
            "compose",
            "-f",
            str(DOCKER_COMPOSE_FILE),
            "up",
            "-d",
            "--remove-orphans",
        ], cwd=FRONTEND_DIR)
        return True
    except CommandError as e:
        print(f"docker compose up failed: {e.message}")
        return False

def run_in_docker_npm(script: str) -> bool:
    try:
        output = run_command([
            "docker",
            "compose",
            "-f",
            str(DOCKER_COMPOSE_FILE),
            "exec",
            "frontend",
            "npm",
            "run",
            script,
        ], cwd=FRONTEND_DIR)
        if output:
            print("\n".join(output))
        print(f"{script}: completed.")
        return True
    except CommandError as e:
        print(f"{script} failed in docker: {e.message}")
        return False
