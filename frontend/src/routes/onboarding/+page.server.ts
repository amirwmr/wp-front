import { isOnboardingComplete } from '$lib/auth/status';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user;
	if (!user) {
		const target = `${url.pathname}${url.search}`;
		const next = target ? `?next=${encodeURIComponent(target)}` : '';
		throw redirect(302, `/login${next}`);
	}
	if (isOnboardingComplete(user)) {
		throw redirect(302, '/dashboard');
	}

	return { user };
};
