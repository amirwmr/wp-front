<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	let {
		label,
		class: className,
		options = [],
		value = $bindable(''),
		...rest
	} = $props<
		{
			label?: string;
			options?: { label: string; value: string }[];
			class?: string;
			value?: string;
		} & HTMLSelectAttributes
	>();
	const selectId = rest.id ?? `select-${Math.random().toString(36).slice(2, 8)}`;
</script>

<div class="flex flex-col gap-1 w-full">
	{#if label}
		<label class="text-sm font-medium text-foreground/80" for={selectId}>{label}</label>
	{/if}
	<select
		id={selectId}
		bind:value
		class={cn(
			'w-full rounded-xl border border-input bg-background px-4 py-3 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-primary',
			className
		)}
		{...rest}
	>
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>
