import { redirect } from '@sveltejs/kit';
import { isOnboardingComplete } from '$lib/auth/status';
import type { User, UserRole } from '$lib/types';

export const requireAuthenticatedUser = (user: User | null, url?: URL) => {
	if (!user) {
		const target = url ? `${url.pathname}${url.search}` : '';
		const next = target ? `?next=${encodeURIComponent(target)}` : '';
		throw redirect(302, `/login${next}`);
	}
	return user;
};

export const requireOnboardedUser = (user: User | null, url?: URL) => {
	const authed = requireAuthenticatedUser(user, url);
	if (!isOnboardingComplete(authed)) {
		throw redirect(302, '/onboarding');
	}
	return authed;
};

export const requireRole = (user: User | null, roles: UserRole[], url?: URL) => {
	const authed = requireAuthenticatedUser(user, url);
	if (!roles.includes(authed.role)) {
		throw redirect(302, '/dashboard');
	}
	return authed;
};
