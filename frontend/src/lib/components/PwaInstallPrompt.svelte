<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import { onMount } from 'svelte';

	type BeforeInstallPromptEvent = Event & {
		prompt: () => Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
	};

	let canInstall = false;
	let promptEvent: BeforeInstallPromptEvent | null = null;

	onMount(() => {
		const handler = (event: Event) => {
			event.preventDefault();
			promptEvent = event as BeforeInstallPromptEvent;
			canInstall = true;
		};
		window.addEventListener('beforeinstallprompt', handler);
		window.addEventListener('appinstalled', () => {
			canInstall = false;
			promptEvent = null;
		});
		return () => window.removeEventListener('beforeinstallprompt', handler);
	});

	const install = async () => {
		if (!promptEvent) return;
		await promptEvent.prompt();
		const choice = await promptEvent.userChoice;
		if (choice.outcome === 'accepted') {
			canInstall = false;
		}
	};
</script>

{#if canInstall}
	<div
		class="rounded-xl border border-border bg-card/80 px-4 py-3 shadow-soft flex items-center gap-3"
	>
		<div class="text-sm">
			<p class="font-semibold">PWA</p>
			<p class="text-muted-foreground">Install the app for quicker access.</p>
		</div>
		<Button size="sm" variant="primary" on:click={install}>Install</Button>
	</div>
{/if}
