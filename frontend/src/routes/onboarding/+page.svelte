<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Select from '$lib/components/ui/select/Select.svelte';
	import { _ } from '$lib/i18n';
	import { apiFetch } from '$lib/utils/api';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import type { User } from '$lib/types';
	import { user as authUserStore } from '$lib/auth';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';

	const { data } = $props<{ data: PageData }>();
	const currentUser = $derived(data.user);
	const role = $derived((currentUser?.role ?? 'couple') as 'couple' | 'vendor');
	const allowedNextPaths: Pathname[] = [
		'/',
		'/dashboard',
		'/website',
		'/guests',
		'/checklist',
		'/vendors',
		'/style-guide'
	];

	let name = $state('');
	let email = $state('');
	let businessName = $state('');
	let businessCategory = $state('');
	let address = $state('');
	let loading = $state(false);
	let nextUrl = $state('');

	const unsubPage = page.subscribe(($page) => {
		nextUrl = $page.url.searchParams.get('next') ?? '';
	});

	$effect(() => {
		name = currentUser?.name ?? '';
		email = currentUser?.email ?? '';
		businessName = currentUser?.vendor_profile?.business_name ?? '';
		businessCategory = currentUser?.vendor_profile?.business_category ?? '';
		address = currentUser?.vendor_profile?.address ?? '';
	});

	onDestroy(() => {
		unsubPage();
	});

	const handleSuccess = async (updated: User) => {
		authUserStore.set(updated);
		await invalidateAll();
		const candidate =
			nextUrl && nextUrl.startsWith('/') ? (nextUrl.split('?')[0] as Pathname) : '/dashboard';
		const safeNext: Pathname = allowedNextPaths.includes(candidate) ? candidate : '/dashboard';
		goto(resolve(safeNext), { replaceState: true });
	};

	const completeCouple = async () => {
		loading = true;
		try {
			const payload = await apiFetch<User>('/api/onboarding/profile/', {
				method: 'PATCH',
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim() || null
				})
			});
			toast.success('پروفایل تکمیل شد');
			await handleSuccess(payload);
		} catch (error) {
			toast.error((error as Error).message);
		} finally {
			loading = false;
		}
	};

	const completeVendor = async () => {
		if (!businessName.trim() || !businessCategory.trim()) {
			toast.error('نام کسب‌وکار و دسته‌بندی الزامی است');
			return;
		}
		loading = true;
		try {
			const payload = await apiFetch<User>('/api/onboarding/vendor/', {
				method: 'PATCH',
				body: JSON.stringify({
					business_name: businessName.trim(),
					business_category: businessCategory.trim(),
					address: address.trim()
				})
			});
			toast.success('پروفایل فروشنده تکمیل شد');
			await handleSuccess(payload);
		} catch (error) {
			toast.error((error as Error).message);
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>{$_('auth.onboarding') ?? 'Onboarding'}</title>
</svelte:head>

<div class="space-y-6">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary uppercase tracking-wide">
			{role === 'vendor' ? 'Vendor onboarding' : 'Couple onboarding'}
		</p>
		<h1 class="text-3xl font-bold">
			{role === 'vendor' ? 'کسب‌وکار خود را ثبت کنید' : 'اطلاعات پروفایل را تکمیل کنید'}
		</h1>
		<p class="text-muted-foreground text-sm">
			{role === 'vendor'
				? 'برای نمایش در مارکت‌پلیس و دریافت سرنخ‌ها، اطلاعات کسب‌وکار را ثبت کنید.'
				: 'برای تجربه شخصی‌سازی شده، نام و ایمیل خود را اضافه کنید.'}
		</p>
	</div>

	<Card class="space-y-4">
		{#if role === 'vendor'}
			<Input label="نام کسب‌وکار" placeholder="Studio Noor" bind:value={businessName} />
			<Select
				label="دسته‌بندی"
				bind:value={businessCategory}
				options={[
					{ label: 'Hall / Venue', value: 'venue' },
					{ label: 'Photography', value: 'photography' },
					{ label: 'Music / Band', value: 'music' },
					{ label: 'Decoration', value: 'decoration' },
					{ label: 'Other', value: 'other' }
				]}
			/>
			<Input label="آدرس یا شهر" placeholder="Tehran" bind:value={address} />
			<div class="flex gap-3">
				<Button class="w-full" on:click={completeVendor} disabled={loading}>
					{loading ? '...' : 'ثبت پروفایل'}
				</Button>
				<Button variant="ghost" href="/dashboard" disabled={loading}>بازگشت</Button>
			</div>
			<p class="text-xs text-muted-foreground">
				حداقل نام کسب‌وکار و دسته‌بندی را پر کنید تا وارد داشبورد فروشنده شوید.
			</p>
		{:else}
			<Input label="نام" placeholder="نام شما" bind:value={name} />
			<Input label="ایمیل" placeholder="you@example.com" type="email" bind:value={email} />
			<div class="flex gap-3">
				<Button class="w-full" on:click={completeCouple} disabled={loading}>
					{loading ? '...' : 'ذخیره'}
				</Button>
				<Button variant="ghost" href="/dashboard" disabled={loading}>بعدا</Button>
			</div>
			<p class="text-xs text-muted-foreground">
				با تکمیل این مرحله، وضعیت آنبوردینگ شما به پایان می‌رسد و به داشبورد هدایت می‌شوید.
			</p>
		{/if}
	</Card>
</div>
