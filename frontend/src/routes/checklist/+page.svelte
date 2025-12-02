<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import { _ } from '$lib/i18n';

	let newTask = '';
	let tasks = [
		{ title: 'Book venue', due: '2025-02-10', status: 'in-progress' },
		{ title: 'Send save-the-dates', due: '2025-02-25', status: 'not-started' },
		{ title: 'Confirm photographer', due: '2025-03-01', status: 'done' }
	];
</script>

<svelte:head>
	<title>{$_('checklist.title')}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-2">
		<p class="text-sm font-semibold text-primary uppercase tracking-wide">Checklist</p>
		<h1 class="text-3xl font-bold">{$_('checklist.title')}</h1>
		<p class="text-muted-foreground">{$_('checklist.subtitle')}</p>
	</div>

	<Card>
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
			<Input class="sm:flex-1" placeholder="New task..." bind:value={newTask} />
			<Button
				variant="primary"
				size="sm"
				on:click={() => {
					if (!newTask) return;
					tasks = [{ title: newTask, due: '2025-03-10', status: 'not-started' }, ...tasks];
					newTask = '';
				}}
			>
				Add Task
			</Button>
		</div>
		<div class="mt-4 grid gap-3 lg:grid-cols-3">
			{#each tasks as task (task.title + task.due)}
				<div class="rounded-xl border border-border bg-muted/60 p-3 space-y-1">
					<p class="font-semibold">{task.title}</p>
					<p class="text-xs text-muted-foreground">Due: {task.due}</p>
					<p class="text-xs rounded-full bg-card inline-block px-2 py-1 capitalize">
						{task.status}
					</p>
				</div>
			{/each}
		</div>
	</Card>
</div>
