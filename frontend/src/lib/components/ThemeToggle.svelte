<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { cn } from '$lib/utils/cn';
	import { Moon, Sun } from 'lucide-svelte';
	import { onDestroy } from 'svelte';

	const { class: className } = $props<{ class?: string }>();

	let current: 'light' | 'dark' = $state('light');
	const unsubscribe = theme.subscribe((value) => {
		current = value;
	});
	onDestroy(unsubscribe);
</script>

<button
	type="button"
	class={cn(
		'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm text-muted-foreground hover:text-foreground',
		className
	)}
	aria-label="Toggle theme"
	onclick={() => theme.toggle()}
>
	{#if current === 'dark'}
		<Sun class="h-5 w-5" />
	{:else}
		<Moon class="h-5 w-5" />
	{/if}
</button>
