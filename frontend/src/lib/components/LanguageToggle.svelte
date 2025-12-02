<script lang="ts">
	import { locale as localeStore } from '$lib/stores/locale';
	import type { Locale } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { i18nLocale } from '$lib/i18n';
	import { onDestroy } from 'svelte';

	const { class: className } = $props<{ class?: string }>();

	let current: Locale = $state('fa');
	const unsubscribe = localeStore.subscribe((value) => {
		current = value;
	});
	onDestroy(unsubscribe);

	const toggle = () => {
		const next: Locale = current === 'fa' ? 'en' : 'fa';
		localeStore.set(next);
		i18nLocale.set(next);
	};
</script>

<button
	type="button"
	class={cn(
		'inline-flex items-center justify-center rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold shadow-sm hover:text-foreground',
		className
	)}
	aria-label="Toggle language"
	onclick={toggle}
>
	{#if current === 'fa'}
		FA / فارسي
	{:else}
		EN / English
	{/if}
</button>
