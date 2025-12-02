<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import { _ } from '$lib/i18n';

	let guestSearch = '';
</script>

<svelte:head>
	<title>{$_('guests.title')}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-2">
		<p class="text-sm font-semibold text-primary uppercase tracking-wide">Guests</p>
		<h1 class="text-3xl font-bold">{$_('guests.title')}</h1>
		<p class="text-muted-foreground">{$_('guests.subtitle')}</p>
	</div>

	<Card>
		<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<Input class="md:max-w-xs" placeholder="Search guest..." bind:value={guestSearch} />
			<div class="flex gap-2">
				<Button variant="secondary" size="sm">Import CSV</Button>
				<Button variant="primary" size="sm">Add Guest</Button>
			</div>
		</div>
		<div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each ['Family', 'Friends', 'Colleagues'] as group (group)}
				<div class="rounded-xl border border-border bg-muted/60 p-3">
					<p class="font-semibold">{group}</p>
					<p class="text-xs text-muted-foreground">12 guests · 8 attending</p>
					<div class="mt-2 flex gap-2">
						<Button size="sm" variant="ghost">View</Button>
						<Button size="sm" variant="secondary">Remind</Button>
					</div>
				</div>
			{/each}
		</div>
	</Card>
</div>
