<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Modal from '$lib/components/ui/modal/Modal.svelte';
	import Select from '$lib/components/ui/select/Select.svelte';
	import Tabs from '$lib/components/ui/tabs/Tabs.svelte';
	import { theme } from '$lib/stores/theme';
	import { _ } from '$lib/i18n';

	let modalOpen = false;
	let tab = 'one';
</script>

<svelte:head>
	<title>{$_('styleGuide.title')}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-2">
		<p class="text-sm font-semibold text-primary uppercase tracking-wide">Design System</p>
		<h1 class="text-3xl font-bold">{$_('styleGuide.title')}</h1>
		<p class="text-muted-foreground text-sm">
			Tokens, components, RTL/LTR proof and dark/light ready.
		</p>
	</div>

	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each [{ name: 'Primary', var: '--primary' }, { name: 'Accent', var: '--accent' }, { name: 'Surface', var: '--card' }, { name: 'Muted', var: '--muted' }, { name: 'Border', var: '--border' }, { name: 'Foreground', var: '--foreground' }] as item (item.var)}
			<div class="rounded-xl border border-border bg-card p-3 shadow-sm">
				<p class="text-sm font-semibold">{item.name}</p>
				<div
					class="mt-2 h-12 w-full rounded-lg border border-dashed"
					style={`background: hsl(var(${item.var}))`}
				></div>
				<p class="text-xs text-muted-foreground mt-1">{item.var}</p>
			</div>
		{/each}
	</div>

	<Card title="Components">
		<div class="flex flex-wrap gap-3">
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button on:click={() => (modalOpen = true)}>Open modal</Button>
			<Button on:click={() => theme.toggle()}>Toggle theme</Button>
		</div>
		<div class="mt-4 grid gap-3 md:grid-cols-2">
			<Input label="Input" placeholder="Your name" />
			<Select
				label="Select"
				options={[
					{ label: 'Option A', value: 'a' },
					{ label: 'Option B', value: 'b' }
				]}
			/>
		</div>
		<div class="mt-4">
			<Tabs
				items={[
					{ label: 'Tab A', value: 'one' },
					{ label: 'Tab B', value: 'two' }
				]}
				value={tab}
				onChange={(value) => (tab = value)}
			/>
		</div>
	</Card>

	<Modal open={modalOpen} title="Dialog" onClose={() => (modalOpen = false)}>
		<p class="text-sm text-muted-foreground">Use this modal for small confirmations or forms.</p>
		<div class="mt-3 flex justify-end gap-2">
			<Button variant="ghost" on:click={() => (modalOpen = false)}>Close</Button>
			<Button variant="primary" on:click={() => (modalOpen = false)}>Confirm</Button>
		</div>
	</Modal>
</div>
