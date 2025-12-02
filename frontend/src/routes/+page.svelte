<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import { APP_NAME } from '$lib/config/app';
	import { _ } from '$lib/i18n';
	import { CheckCircle2, Globe2, Smartphone, Users } from 'lucide-svelte';
</script>

<svelte:head>
	<title>{APP_NAME} | Wedding platform</title>
	<meta
		name="description"
		content="Wedding OS landing — OTP auth, website builder, guest list, checklist, vendor marketplace."
	/>
</svelte:head>

<div class="grid gap-8 lg:grid-cols-2 items-center">
	<div class="space-y-6">
		<p
			class="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-semibold"
		>
			SSR · PWA · OTP Login
		</p>
		<h1 class="text-3xl md:text-4xl font-bold leading-tight">{$_('hero.title')}</h1>
		<p class="text-lg text-muted-foreground leading-relaxed">{$_('hero.subtitle')}</p>
		<div class="flex flex-wrap gap-3">
			<Button href="/login" size="lg">{$_('hero.ctaPrimary')}</Button>
			<Button variant="secondary" href="/dashboard" size="lg">{$_('hero.ctaSecondary')}</Button>
		</div>
		<div class="grid grid-cols-2 gap-3 text-sm">
			<div class="flex items-center gap-2 text-foreground">
				<CheckCircle2 class="h-5 w-5 text-primary" />
				<span>OTP + JWT</span>
			</div>
			<div class="flex items-center gap-2 text-foreground">
				<Globe2 class="h-5 w-5 text-primary" />
				<span>SSR SEO pages</span>
			</div>
			<div class="flex items-center gap-2 text-foreground">
				<Users class="h-5 w-5 text-primary" />
				<span>Couple + Vendor</span>
			</div>
			<div class="flex items-center gap-2 text-foreground">
				<Smartphone class="h-5 w-5 text-primary" />
				<span>PWA ready</span>
			</div>
		</div>
	</div>
	<div class="grid gap-4">
		<Card title={$_('dashboard.cards.website')} description={$_('website.subtitle')}>
			<div class="flex items-center justify-between">
				<div class="space-y-2">
					<p class="text-sm text-muted-foreground">Templates · RTL ready</p>
					<div class="flex gap-2">
						<Button size="sm" variant="primary" href="/website">Open builder</Button>
						<Button size="sm" variant="ghost" href="/style-guide">Style guide</Button>
					</div>
				</div>
				<div
					class="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold"
				>
					SSR
				</div>
			</div>
		</Card>
		<div class="grid gap-4 sm:grid-cols-2">
			<Card title={$_('guests.title')} description={$_('guests.subtitle')}>
				<ul class="text-sm text-muted-foreground space-y-1">
					<li>• CSV import/export</li>
					<li>• RSVP tokens</li>
					<li>• Meal preferences</li>
				</ul>
			</Card>
			<Card title={$_('checklist.title')} description={$_('checklist.subtitle')}>
				<ul class="text-sm text-muted-foreground space-y-1">
					<li>• Timeline templates</li>
					<li>• Reminders & sync</li>
					<li>• Offline cache</li>
				</ul>
			</Card>
		</div>
	</div>
</div>
