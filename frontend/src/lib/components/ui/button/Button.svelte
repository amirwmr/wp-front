<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { createEventDispatcher } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
	type Size = 'sm' | 'md' | 'lg';

	const dispatch = createEventDispatcher<{ click: MouseEvent }>();

	type ButtonProps = {
		variant?: Variant;
		size?: Size;
		href?: Pathname;
		class?: string;
		children?: unknown;
	} & HTMLButtonAttributes &
		Omit<HTMLAnchorAttributes, 'href'>;

	const props = $props();

	let {
		class: className,
		variant = 'primary' as Variant,
		size = 'md' as Size,
		href = undefined,
		children,
		...rest
	} = props satisfies ButtonProps;

	const selectedVariant: Variant = variant;
	const selectedSize: Size = size;

	const base =
		'inline-flex items-center justify-center rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed gap-2';

	const variants: Record<Variant, string> = {
		primary: 'bg-primary text-primary-foreground shadow-soft hover:translate-y-[-1px]',
		secondary: 'bg-secondary text-secondary-foreground hover:translate-y-[-1px]',
		ghost: 'bg-transparent text-foreground hover:bg-muted',
		outline: 'border border-border text-foreground hover:bg-muted'
	};

	const sizes: Record<Size, string> = {
		sm: 'h-9 px-3 text-sm',
		md: 'h-11 px-4 text-sm',
		lg: 'h-12 px-6 text-base'
	};

	const classes = $derived(cn(base, variants[selectedVariant], sizes[selectedSize], className));

	const handleClick = (event: MouseEvent) => {
		dispatch('click', event);
	};
</script>

{#if href}
	<a href={resolve(href)} class={classes} {...rest}>
		{@render children?.()}
	</a>
{:else}
	<button class={classes} type="button" onclick={handleClick} {...rest}
		>{@render children?.()}</button
	>
{/if}
