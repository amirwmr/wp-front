<script lang="ts">
	import { cn } from '$lib/utils/cn';

	const {
		class: className,
		title,
		description,
		children,
		actions
	} = $props<{
		class?: string;
		title?: string;
		description?: string;
		children?: unknown;
		actions?: unknown;
	}>();
</script>

<section class={cn('rounded-2xl border border-border bg-card shadow-card p-6', className)}>
	{#if title}
		<div class="flex items-center justify-between gap-2 mb-2">
			<h3 class="text-lg font-semibold">{title}</h3>
			{@render actions?.()}
		</div>
	{/if}
	{#if description}
		<p class="text-sm text-muted-foreground mb-3">{description}</p>
	{/if}
	{@render children()}
</section>
