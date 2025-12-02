# 🚢 Frontend K8s Manifests (sample)

> Minimal kustomize-ready manifests for the SvelteKit frontend. Copy this folder to `k8s/`, update image/hosts/env, and apply.

## Files

- `namespace.yaml` — Isolates resources (edit the namespace name if you prefer).
- `configmap.yaml` — Public/runtime env values like `PUBLIC_API_BASE_URL`, `API_INTERNAL_BASE_URL`, `AUTH_COOKIE_SECURE`.
- `deployment-frontend.yaml` — Single-replica Node runtime for the built app (port 3000).
- `service-frontend.yaml` — ClusterIP service exposing the app on port 80 → 3000.
- `ingress.yaml` — Basic HTTP ingress for a host like `front.example.com`.
- `kustomization.yaml` — Kustomize entrypoint tying the resources together.

## Usage

1. Copy this folder to `k8s/` and adjust names/hosts/env/image tags.
2. Update `configmap.yaml` with your API base URL(s) and cookie security flag to match your backend ingress.
3. Build/push the frontend image (see `docker-compose.production.yml` for the Dockerfile path).
4. Deploy with:
   ```bash
   kubectl apply -k k8s/
   ```
