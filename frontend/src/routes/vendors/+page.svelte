<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Select from '$lib/components/ui/select/Select.svelte';
	import { _ } from '$lib/i18n';

	let category = 'all';
	let search = '';

	const vendors = [
		{ name: 'Noor Hall', category: 'venue', city: 'Tehran', price: '$$', rating: 4.8 },
		{ name: 'Light Studio', category: 'photographer', city: 'Karaj', price: '$$', rating: 4.6 },
		{ name: 'Roya Band', category: 'music', city: 'Tehran', price: '$', rating: 4.7 }
	];
</script>

<svelte:head>
	<title>{$_('vendors.title')}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-2">
		<p class="text-sm font-semibold text-primary uppercase tracking-wide">Marketplace</p>
		<h1 class="text-3xl font-bold">{$_('vendors.title')}</h1>
		<p class="text-muted-foreground">{$_('vendors.subtitle')}</p>
	</div>

	<Card>
		<div class="grid gap-3 sm:grid-cols-4">
			<Input class="sm:col-span-2" placeholder="Search vendor..." bind:value={search} />
			<Select
				label="Category"
				bind:value={category}
				options={[
					{ label: 'All', value: 'all' },
					{ label: 'Venue', value: 'venue' },
					{ label: 'Photographer', value: 'photographer' },
					{ label: 'Music', value: 'music' }
				]}
			/>
			<Button variant="secondary" class="h-full">Filter</Button>
		</div>

		<div class="mt-4 grid gap-3 md:grid-cols-2">
			{#each vendors.filter((v) => category === 'all' || v.category === category) as vendor (vendor.name + vendor.city)}
				<div class="rounded-xl border border-border bg-muted/60 p-4 flex flex-col gap-2">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-lg font-semibold">{vendor.name}</p>
							<p class="text-xs text-muted-foreground capitalize">
								{vendor.category} · {vendor.city}
							</p>
						</div>
						<p class="text-sm font-semibold text-primary">{vendor.rating}★</p>
					</div>
					<p class="text-sm text-muted-foreground">Pricing: {vendor.price}</p>
					<div class="flex gap-2">
						<Button size="sm" variant="secondary">View profile</Button>
						<Button size="sm" variant="primary">Send inquiry</Button>
					</div>
				</div>
			{/each}
		</div>
	</Card>
</div>
