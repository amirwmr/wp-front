<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { logout, user as userStore } from '$lib/auth';
	import type { User } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { _, i18nLocale } from '$lib/i18n';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { Menu, X } from 'lucide-svelte';
	import { onDestroy } from 'svelte';

	const { user, dir } = $props<{
		user: User | null;
		dir: 'rtl' | 'ltr';
	}>();

	let mobileOpen = $state(false);
	let lang = $state('fa');
	let liveUser = $derived(user);

	// liveUser is derived from the prop; store subscription below keeps it synced on client

	const unsub = i18nLocale.subscribe((value) => {
		lang = value ?? 'fa';
	});
	const unsubUser = userStore.subscribe((value) => {
		liveUser = value ?? user;
	});
	onDestroy(() => {
		unsub();
		unsubUser();
	});

	const navItems: { href: Pathname; key: string }[] = [
		{ href: '/', key: 'nav.home' },
		{ href: '/dashboard', key: 'nav.dashboard' },
		{ href: '/website', key: 'nav.website' },
		{ href: '/guests', key: 'nav.guests' },
		{ href: '/checklist', key: 'nav.checklist' },
		{ href: '/vendors', key: 'nav.vendors' },
		{ href: '/style-guide', key: 'nav.styleGuide' }
	];

	const handleLogout = async () => {
		await logout();
		await invalidateAll();
		goto(resolve('/login'));
	};
</script>

<header
	{dir}
	class={cn(
		'sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70'
	)}
>
	<div class="container flex h-16 items-center justify-between gap-2 px-4 sm:px-6">
		<div class="flex items-center gap-2 sm:gap-3">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold shadow-soft"
			>
				💐
			</div>
			<div class="leading-tight">
				<p class="text-base font-semibold">Wedding OS</p>
				<p class="text-[11px] text-muted-foreground hidden sm:block">
					SSR · PWA · {lang === 'fa' ? 'RTL' : 'LTR'}
				</p>
			</div>
		</div>

		<nav class="hidden lg:flex items-center gap-2">
			{#each navItems as item (item.href)}
				<a
					href={resolve(item.href)}
					class={cn(
						'rounded-lg px-3 py-2 text-sm font-semibold transition hover:text-foreground',
						$page.url.pathname === item.href ? 'text-foreground bg-muted' : 'text-muted-foreground'
					)}
				>
					{$_(item.key)}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<LanguageToggle class="hidden sm:inline-flex" />
			<ThemeToggle class="hidden sm:inline-flex" />
			{#if liveUser}
				<Button variant="ghost" size="sm" class="hidden sm:inline-flex" href="/dashboard"
					>{$_('nav.dashboard')}</Button
				>
				<Button variant="secondary" size="sm" class="hidden sm:inline-flex" on:click={handleLogout}
					>{$_('nav.logout')}</Button
				>
			{:else}
				<Button variant="primary" size="sm" class="hidden sm:inline-flex" href="/login"
					>{$_('nav.login')}</Button
				>
			{/if}
			<button
				class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground lg:hidden"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label="Toggle navigation"
			>
				{#if mobileOpen}
					<X class="h-5 w-5" />
				{:else}
					<Menu class="h-5 w-5" />
				{/if}
			</button>
		</div>
	</div>

	{#if mobileOpen}
		<div class="lg:hidden border-t border-border bg-background">
			<nav class="container flex flex-col gap-2 px-4 py-3">
				<div class="flex items-center justify-between gap-2">
					<LanguageToggle />
					<ThemeToggle />
				</div>
				{#each navItems as item (item.href)}
					<a
						href={resolve(item.href)}
						class="rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
						onclick={() => (mobileOpen = false)}
					>
						{$_(item.key)}
					</a>
				{/each}
				{#if liveUser}
					<button
						class="text-left rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
						onclick={() => {
							mobileOpen = false;
							handleLogout();
						}}
					>
						{$_('nav.logout')}
					</button>
				{:else}
					<a
						href={resolve('/login')}
						class="text-left rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
						onclick={() => (mobileOpen = false)}
					>
						{$_('nav.login')}
					</a>
				{/if}
			</nav>
		</div>
	{/if}
</header>
