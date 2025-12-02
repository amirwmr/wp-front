<script lang="ts">
	import { cn } from '$lib/utils/cn';

	const {
		open = false,
		title,
		class: className,
		onClose,
		children
	} = $props<{
		open: boolean;
		title?: string;
		onClose?: () => void;
		class?: string;
		children?: unknown;
	}>();
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
		<div class={cn('w-full max-w-lg rounded-2xl bg-card p-6 shadow-card', className)}>
			<div class="flex items-center justify-between gap-2 mb-3">
				{#if title}
					<h3 class="text-lg font-semibold">{title}</h3>
				{/if}
				<button
					type="button"
					class="rounded-full p-2 hover:bg-muted text-muted-foreground"
					onclick={() => onClose?.()}
					aria-label="Close"
				>
					&times;
				</button>
			</div>
			{@render children?.()}
		</div>
	</div>
{/if}
