<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		label,
		error,
		caption,
		class: className,
		value = $bindable(''),
		...rest
	} = $props<
		{
			label?: string;
			error?: string;
			caption?: string;
			class?: string;
			value?: string;
		} & HTMLInputAttributes
	>();

	const inputId = rest.id ?? `input-${Math.random().toString(36).slice(2, 8)}`;
</script>

<div class="flex flex-col gap-1 w-full">
	{#if label}
		<label class="text-sm font-medium text-foreground/80" for={inputId}>{label}</label>
	{/if}
	<input
		bind:value
		id={inputId}
		class={cn(
			'w-full rounded-xl border border-input bg-background px-4 py-3 text-base shadow-sm transition focus-visible:ring-2 focus-visible:ring-primary',
			error ? 'border-destructive' : '',
			className
		)}
		{...rest}
	/>
	{#if caption}
		<p class="text-xs text-muted-foreground">{caption}</p>
	{/if}
	{#if error}
		<p class="text-xs text-destructive">{error}</p>
	{/if}
</div>
