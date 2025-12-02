<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Select from '$lib/components/ui/select/Select.svelte';
	import { _ } from '$lib/i18n';

	let theme = 'classic';
	let title = '';
	let password = '';
</script>

<svelte:head>
	<title>{$_('website.title')}</title>
	<meta
		name="description"
		content="Wedding website builder shell with templates and publish toggles."
	/>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-2">
		<p class="text-sm font-semibold text-primary uppercase tracking-wide">Builder</p>
		<h1 class="text-3xl font-bold">{$_('website.title')}</h1>
		<p class="text-muted-foreground">{$_('website.subtitle')}</p>
	</div>

	<div class="grid gap-4 lg:grid-cols-3">
		<Card title="Template" description="Choose a style and publish.">
			<Select
				bind:value={theme}
				options={[
					{ label: 'Classic Blush', value: 'classic' },
					{ label: 'Minimal Serif', value: 'minimal' },
					{ label: 'Vibrant Night', value: 'dark' }
				]}
			/>
			<div class="mt-4 flex gap-2">
				<Button variant="primary" size="sm">Preview</Button>
				<Button variant="secondary" size="sm">Apply</Button>
			</div>
		</Card>

		<Card title="Story & Meta" description="Hero content + SEO tags">
			<Input label="Title" placeholder="Sara & Ali" bind:value={title} />
			<Input label="Meta description" placeholder="We’re getting married!" />
			<Button class="mt-3" variant="primary" size="sm">Save draft</Button>
		</Card>

		<Card title="Privacy" description="Public or password protected">
			<Input
				label="Password"
				placeholder="•••••"
				type="password"
				bind:value={password}
				caption="Guests must enter this to view if set."
			/>
			<div class="mt-3 flex gap-2">
				<Button variant="secondary" size="sm">Save</Button>
				<Button variant="primary" size="sm">Publish</Button>
			</div>
		</Card>
	</div>

	<Card title="Blocks" description="Core sections included in MVP.">
		<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#each ['Story', 'Gallery', 'Schedule', 'FAQ', 'RSVP Embed'] as block (block)}
				<div class="rounded-xl border border-border bg-muted/70 p-3">
					<p class="font-semibold">{block}</p>
					<p class="text-xs text-muted-foreground">Toggle visibility, edit content, reorder.</p>
				</div>
			{/each}
		</div>
	</Card>
</div>
