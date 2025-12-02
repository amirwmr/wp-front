import { json } from '@sveltejs/kit';
import { AUTH_COOKIE_NAMES } from '$lib/config/app';
import { refreshSessionTokens } from '$lib/server/api';
import { clearSessionCookies, persistSessionCookies } from '$lib/server/session';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const refresh = event.cookies.get(AUTH_COOKIE_NAMES.refresh);
	if (!refresh) {
		clearSessionCookies(event);
		return json({ message: 'No session available' }, { status: 401 });
	}

	const tokens = await refreshSessionTokens(event, refresh);
	if (!tokens) {
		clearSessionCookies(event);
		event.locals.user = null;
		event.locals.accessToken = null;
		event.locals.refreshToken = null;
		return json({ message: 'Session expired' }, { status: 401 });
	}

	persistSessionCookies(event, tokens);
	event.locals.accessToken = tokens.access;
	event.locals.refreshToken = tokens.refresh;

	return json(tokens);
};
