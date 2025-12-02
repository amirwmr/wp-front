import type { RequestEvent } from '@sveltejs/kit';
import { AUTH_COOKIE_NAMES } from '$lib/config/app';
import type { SessionTokens } from '$lib/types';

export const ACCESS_COOKIE_MAX_AGE = 5 * 60; // align with backend access lifetime (5 minutes)
export const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const baseCookieOptions = (event: RequestEvent) => ({
	path: '/',
	sameSite: 'lax' as const,
	secure: process.env.AUTH_COOKIE_SECURE === 'true' || event.url.protocol === 'https:'
});

export const persistSessionCookies = (event: RequestEvent, tokens: SessionTokens) => {
	const options = baseCookieOptions(event);
	event.cookies.set(AUTH_COOKIE_NAMES.access, tokens.access, {
		...options,
		httpOnly: false,
		maxAge: ACCESS_COOKIE_MAX_AGE
	});
	event.cookies.set(AUTH_COOKIE_NAMES.refresh, tokens.refresh, {
		...options,
		httpOnly: true,
		maxAge: REFRESH_COOKIE_MAX_AGE
	});
};

export const clearSessionCookies = (event: RequestEvent) => {
	event.cookies.delete(AUTH_COOKIE_NAMES.access, { path: '/' });
	event.cookies.delete(AUTH_COOKIE_NAMES.refresh, { path: '/' });
};
