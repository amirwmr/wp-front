import type { Handle, HandleFetch } from '@sveltejs/kit';
import { AUTH_COOKIE_NAMES } from '$lib/config/app';
import { fetchMe, refreshSessionTokens, API_BASE } from '$lib/server/api';
import { clearSessionCookies, persistSessionCookies } from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
	let accessToken = event.cookies.get(AUTH_COOKIE_NAMES.access) ?? null;
	let refreshToken = event.cookies.get(AUTH_COOKIE_NAMES.refresh) ?? null;
	let user = null;

	if (accessToken) {
		user = await fetchMe(event, accessToken);
	}

	if (accessToken && !user && !refreshToken) {
		clearSessionCookies(event);
		accessToken = null;
	}

	if (!user && refreshToken) {
		const refreshed = await refreshSessionTokens(event, refreshToken);
		if (refreshed) {
			persistSessionCookies(event, refreshed);
			accessToken = refreshed.access;
			refreshToken = refreshed.refresh;
			user = await fetchMe(event, refreshed.access);
		} else {
			clearSessionCookies(event);
			accessToken = null;
			refreshToken = null;
		}
	}

	event.locals.user = user;
	event.locals.accessToken = accessToken;
	event.locals.refreshToken = refreshToken;

	return resolve(event);
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (
		event.locals.accessToken &&
		request.url.startsWith(API_BASE) &&
		!request.headers.get('Authorization')
	) {
		const headers = new Headers(request.headers);
		headers.set('Authorization', `Bearer ${event.locals.accessToken}`);
		request = new Request(request, { headers });
	}
	return fetch(request);
};
