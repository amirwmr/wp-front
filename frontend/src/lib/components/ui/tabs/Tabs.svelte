<script lang="ts">
	import { cn } from '$lib/utils/cn';

	const { items, value, onChange } = $props<{
		items: { label: string; value: string }[];
		value: string;
		onChange: (value: string) => void;
	}>();
</script>

<div class="inline-flex rounded-xl bg-muted p-1">
	{#each items as item (item.value)}
		<button
			type="button"
			class={cn(
				'px-4 py-2 text-sm font-semibold rounded-lg transition',
				item.value === value ? 'bg-card shadow-soft' : 'text-muted-foreground'
			)}
			onclick={() => onChange(item.value)}
		>
			{item.label}
		</button>
	{/each}
</div>
