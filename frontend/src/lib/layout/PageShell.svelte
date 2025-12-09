<script lang="ts">
	import AppFooter from '$lib/components/layout/AppFooter.svelte';
	import AppHeader from '$lib/components/layout/AppHeader.svelte';
	import PwaInstallPrompt from '$lib/components/PwaInstallPrompt.svelte';
	import ToastProvider from '$lib/components/ui/toast/ToastProvider.svelte';
	import { setContext } from 'svelte';
	import type { User } from '$lib/types';
	import type { Snippet } from 'svelte';

	const {
		children,
		dir = 'rtl',
		locale = 'fa',
		theme = 'light',
		user = null,
		apiBase
	} = $props<{
		children: Snippet;
		dir?: 'rtl' | 'ltr';
		locale?: string;
		theme?: 'light' | 'dark';
		user?: User | null;
		apiBase?: string;
	}>();

	$effect(() => {
		setContext('apiBase', apiBase);
	});

	// No global event needed; the header reads from Svelte store and user prop updates via SSR
</script>

<div
	class="min-h-screen bg-gradient-to-b from-background via-background to-muted text-foreground"
	class:rtl={dir === 'rtl'}
	data-theme={theme}
	{dir}
	lang={locale}
>
	<div
		class="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(244,109,155,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(120,119,198,0.1),transparent_40%)]"
	></div>
	<div class="relative flex min-h-screen flex-col">
		<AppHeader {user} {dir} />
		<main class="container w-full flex-1 py-6 md:py-10 space-y-4">
			<PwaInstallPrompt />
			{@render children()}
		</main>
		<AppFooter />
	</div>
	<ToastProvider {dir} />
</div>
