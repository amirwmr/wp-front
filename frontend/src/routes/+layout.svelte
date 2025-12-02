<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { APP_NAME } from '$lib/config/app';
	import { setupI18n, i18nLocale } from '$lib/i18n';
	import { locale as localeStore } from '$lib/stores/locale';
	import { theme as themeStore } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import PageShell from '$lib/layout/PageShell.svelte';
	import { initAuth } from '$lib/auth';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	const { children, data } = $props<{ children: Snippet; data: LayoutData }>();

	let localeValue = $state<LayoutData['locale']>('fa');
	let themeValue = $state<LayoutData['theme']>('light');
	const dir = $derived(localeValue === 'fa' ? 'rtl' : 'ltr');

	$effect(() => {
		localeValue = data.locale;
		themeValue = data.theme;
	});

	$effect(() => {
		setupI18n(localeValue);
		if (!browser) {
			localeStore.set(localeValue);
			themeStore.set(themeValue);
		}
	});

	$effect(() => {
		initAuth(data.user ?? null);
	});

	onMount(() => {
		setupI18n(localeValue);
		localeStore.init(localeValue);
		themeStore.init(themeValue);
		i18nLocale.set(localeValue);

		const unsubLocale = localeStore.subscribe((value) => {
			localeValue = value;
		});
		const unsubTheme = themeStore.subscribe((value) => {
			themeValue = value;
		});

		return () => {
			unsubLocale();
			unsubTheme();
		};
	});
</script>

<svelte:head>
	<title>{APP_NAME}</title>
	<meta
		name="description"
		content="Wedding OS — SvelteKit + PWA frontend for planning, RSVPs, and vendor marketplace."
	/>
	<link rel="icon" href="/icons/icon-192.png" />
</svelte:head>

<PageShell {dir} locale={localeValue} theme={themeValue} user={data.user} apiBase={data.apiBase}>
	{@render children()}
</PageShell>
