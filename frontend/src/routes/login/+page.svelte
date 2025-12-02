<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Tabs from '$lib/components/ui/tabs/Tabs.svelte';
	import type { OtpVerifyResponse, User } from '$lib/types';
	import { toast } from 'svelte-sonner';
	import { _, i18nLocale } from '$lib/i18n';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { requestOtp, verifyOtp, fetchMeClient, initAuth } from '$lib/auth';
	import { isOnboardingComplete } from '$lib/auth/status';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';

	let role: 'couple' | 'vendor' = 'couple';
	let phone = '';
	let otp = '';
	let step: 'request' | 'verify' = 'request';
	let loading = false;
	let lang = 'fa';
	let debugCode: string | null = null;
	let nextUrl = '';
	const allowedNextPaths: Pathname[] = [
		'/',
		'/dashboard',
		'/website',
		'/guests',
		'/checklist',
		'/vendors',
		'/style-guide'
	];

	const unsub = i18nLocale.subscribe((value) => (lang = value ?? 'fa'));
	const unsubPage = page.subscribe(($page) => {
		nextUrl = $page.url.searchParams.get('next') ?? '';
	});
	onDestroy(() => {
		unsub();
		unsubPage();
	});

	const normalizePhone = (raw: string) => {
		const trimmed = raw.trim();
		if (!trimmed) return null;
		if (trimmed.startsWith('+')) return trimmed;
		const digits = trimmed.replace(/\D/g, '');
		if (!digits) return null;
		if (digits.startsWith('0')) {
			return `+98${digits.slice(1)}`;
		}
		// assume already without leading zero, prepend country code
		return `+98${digits}`;
	};

	const requestOtpHandler = async () => {
		const phoneNormalized = normalizePhone(phone);
		if (!phoneNormalized || phoneNormalized.replace(/\D/g, '').length < 10) {
			toast.error(lang === 'fa' ? 'شماره نامعتبر است' : 'Invalid phone number');
			return;
		}
		loading = true;
		debugCode = null;
		try {
			const res = await requestOtp(phoneNormalized, role);
			debugCode = res?.debug_code ?? null;
			toast.success(lang === 'fa' ? 'کد ارسال شد' : 'OTP sent');
			step = 'verify';
		} catch (error) {
			toast.error((error as Error).message);
		} finally {
			loading = false;
		}
	};

	const verifyOtpHandler = async () => {
		const phoneNormalized = normalizePhone(phone);
		if (!otp.trim() || !phoneNormalized) {
			toast.error(lang === 'fa' ? 'کد را وارد کنید' : 'Enter the code');
			return;
		}
		loading = true;
		try {
			const payload = await verifyOtp(phoneNormalized, otp.trim(), role);
			await handleLoginSuccess(payload);
		} catch (error) {
			toast.error((error as Error).message);
			otp = '';
		} finally {
			loading = false;
		}
	};

	const handleLoginSuccess = async (payload: OtpVerifyResponse) => {
		let profile: User | null = payload.user ?? null;
		try {
			if (!profile) {
				profile = await fetchMeClient();
			}
			if (profile) {
				initAuth(profile);
			}
			toast.success(lang === 'fa' ? 'ورود موفق' : 'Login successful');
			await invalidateAll();
			const needsOnboarding = !isOnboardingComplete(profile);
			const candidate =
				nextUrl && nextUrl.startsWith('/') ? (nextUrl.split('?')[0] as Pathname) : '/dashboard';
			const safeNext: Pathname = allowedNextPaths.includes(candidate) ? candidate : '/dashboard';
			const onboardingBase = resolve('/onboarding');
			const target = needsOnboarding
				? onboardingBase +
					(safeNext !== '/dashboard' ? `?next=${encodeURIComponent(safeNext)}` : '')
				: resolve(safeNext);
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto(target, { replaceState: true });
		} catch (error) {
			toast.error((error as Error).message || 'Unable to load profile');
		}
	};
</script>

<svelte:head>
	<title>{$_('auth.title')}</title>
</svelte:head>

<div class="mx-auto max-w-3xl space-y-6">
	<div class="flex items-center justify-between gap-3">
		<div>
			<p class="text-sm font-semibold text-primary uppercase tracking-wide">OTP Login</p>
			<h1 class="text-2xl md:text-3xl font-bold">{$_('auth.title')}</h1>
			<p class="text-sm text-muted-foreground">{$_('auth.subtitle')}</p>
		</div>
		<Tabs
			items={[
				{ label: $_('auth.roleCouple'), value: 'couple' },
				{ label: $_('auth.roleVendor'), value: 'vendor' }
			]}
			value={role}
			onChange={(val) => {
				role = val as typeof role;
				step = 'request';
			}}
		/>
	</div>

	<Card class="grid gap-4 md:grid-cols-2">
		<div class="space-y-4">
			<Input
				label={$_('auth.phoneLabel')}
				placeholder="09xx xxx xxxx"
				type="tel"
				bind:value={phone}
			/>

			{#if step === 'verify'}
				<Input label={$_('auth.otpLabel')} placeholder="123456" type="text" bind:value={otp} />
			{/if}

			<div class="flex gap-3">
				{#if step === 'request'}
					<Button class="w-full" on:click={requestOtpHandler} disabled={loading}>
						{loading ? '...' : $_('auth.requestCode')}
					</Button>
				{:else}
					<Button class="w-full" on:click={verifyOtpHandler} disabled={loading}>
						{loading ? '...' : $_('auth.verifyCode')}
					</Button>
					<Button
						variant="ghost"
						on:click={() => {
							step = 'request';
							otp = '';
							debugCode = null;
						}}
					>
						{$_('auth.changeNumber')}
					</Button>
				{/if}
			</div>
			{#if role === 'vendor'}
				<p class="text-xs text-muted-foreground">{$_('auth.vendorHint')}</p>
			{/if}
		</div>
		<div class="rounded-2xl border border-dashed border-border bg-muted/70 p-4 space-y-3">
			<h3 class="text-lg font-semibold">Flow</h3>
			<ol class="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
				<li>Enter mobile number and choose your role.</li>
				<li>Backend sends OTP via /api/auth/otp/request/.</li>
				<li>Enter the code; we verify via /api/auth/otp/verify/ with your actor.</li>
				<li>Tokens are stored in secure cookies + sessionStorage for SSR loads.</li>
				<li>We fetch /api/auth/me/ and redirect to onboarding or dashboard.</li>
			</ol>
			{#if debugCode}
				<p class="text-xs text-muted-foreground">
					Debug code (dev only): <span class="font-mono text-foreground">{debugCode}</span>
				</p>
			{/if}
		</div>
	</Card>
</div>
