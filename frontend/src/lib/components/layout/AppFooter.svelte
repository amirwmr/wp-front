<script lang="ts">
	import { APP_NAME } from '$lib/config/app';
	import { _, i18nLocale } from '$lib/i18n';
	import { resolve } from '$app/paths';
	import { onDestroy } from 'svelte';

	let lang = 'fa';
	const unsub = i18nLocale.subscribe((value) => (lang = value ?? 'fa'));
	onDestroy(unsub);
</script>

<footer class="border-t border-border bg-background/85 backdrop-blur md:sticky md:bottom-0 md:z-20">
	<div
		class="container flex flex-col gap-2 py-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between"
	>
		<p class="font-semibold text-foreground">{APP_NAME}</p>
		<div class="flex flex-wrap items-center gap-3">
			<span>{lang === 'fa' ? 'ساخته شده با SvelteKit + PWA' : 'Built with SvelteKit + PWA'}</span>
			<span class="hidden sm:inline-block">|</span>
			<a class="hover:text-foreground" href={resolve('/style-guide')}>{$_('nav.styleGuide')}</a>
			<a class="hover:text-foreground" href="mailto:hello@example.com">hello@example.com</a>
		</div>
	</div>
</footer>
