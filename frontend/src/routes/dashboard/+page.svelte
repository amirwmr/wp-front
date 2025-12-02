<script lang="ts">
	import Card from '$lib/components/ui/card/Card.svelte';
	import Button from '$lib/components/ui/button/Button.svelte';
	import { _ } from '$lib/i18n';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();
	const role = $derived(data.user?.role ?? 'couple');

	const coupleCards = [
		{ title: $_('dashboard.cards.website'), href: '/website' },
		{ title: $_('dashboard.cards.guests'), href: '/guests' },
		{ title: $_('dashboard.cards.checklist'), href: '/checklist' },
		{ title: $_('dashboard.cards.vendors'), href: '/vendors' },
		{ title: $_('dashboard.cards.budget'), href: '/dashboard#budget' },
		{ title: $_('dashboard.cards.pwa'), href: '/style-guide' }
	];

	const vendorCards = [
		{ title: 'Profile completeness', href: '/vendors' },
		{ title: 'Lead inbox', href: '/vendors' },
		{ title: 'Marketplace placement', href: '/vendors' }
	];
</script>

<svelte:head>
	<title>{$_('dashboard.title')}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-2">
		<p class="text-sm text-primary font-semibold uppercase tracking-wide">
			{$_('dashboard.welcome')}
		</p>
		<h1 class="text-3xl font-bold">{$_('dashboard.title')}</h1>
		<p class="text-muted-foreground text-sm">
			{role === 'vendor'
				? 'Manage your vendor portal, respond to leads, and update your marketplace profile.'
				: 'Jump into your most important wedding areas with quick links and live cards.'}
		</p>
	</div>

	<div class="grid gap-4 md:grid-cols-3">
		{#if role === 'vendor'}
			{#each vendorCards as card (card.title)}
				<Card title={card.title} class="h-full">
					<Button variant="secondary" size="sm" href={card.href}>Open</Button>
				</Card>
			{/each}
		{:else}
			{#each coupleCards as card (card.title)}
				<Card title={card.title} class="h-full">
					<Button variant="secondary" size="sm" href={card.href}>Open</Button>
				</Card>
			{/each}
		{/if}
	</div>

	<Card title="Status" description="Realtime checks for SSR, PWA and auth.">
		<div class="grid gap-3 sm:grid-cols-3 text-sm">
			<div class="rounded-xl bg-muted p-3">
				<p class="font-semibold">SSR</p>
				<p class="text-muted-foreground">Server-rendered layout with locale + theme.</p>
			</div>
			<div class="rounded-xl bg-muted p-3">
				<p class="font-semibold">PWA</p>
				<p class="text-muted-foreground">Manifest + service worker ready for install.</p>
			</div>
			<div class="rounded-xl bg-muted p-3">
				<p class="font-semibold">Auth</p>
				<p class="text-muted-foreground">
					{data.user ? 'Authenticated via cookies' : 'Anonymous — login to sync data'}
				</p>
			</div>
		</div>
	</Card>
</div>
