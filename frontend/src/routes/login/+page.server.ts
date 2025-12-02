import { isOnboardingComplete } from '$lib/auth/status';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		const next = url.searchParams.get('next');
		const safeNext = next && next.startsWith('/') ? next : '/dashboard';
		if (!isOnboardingComplete(locals.user)) {
			const onboardingTarget =
				next && next.startsWith('/')
					? `/onboarding?next=${encodeURIComponent(next)}`
					: '/onboarding';
			throw redirect(302, onboardingTarget);
		}
		throw redirect(302, safeNext);
	}
	return {};
};
