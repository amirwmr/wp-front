import { json } from '@sveltejs/kit';
import { persistSessionCookies, clearSessionCookies } from '$lib/server/session';
import type { RequestHandler } from './$types';
import type { SessionTokens } from '$lib/types';

export const POST: RequestHandler = async (event) => {
	let tokens: SessionTokens | null = null;
	try {
		tokens = (await event.request.json()) as SessionTokens;
	} catch {
		return json({ message: 'Invalid payload' }, { status: 400 });
	}

	if (!tokens?.access || !tokens?.refresh) {
		return json({ message: 'Missing tokens' }, { status: 400 });
	}

	persistSessionCookies(event, tokens);
	event.locals.accessToken = tokens.access;
	event.locals.refreshToken = tokens.refresh;

	return json({ ok: true });
};

export const DELETE: RequestHandler = async (event) => {
	clearSessionCookies(event);
	event.locals.user = null;
	event.locals.accessToken = null;
	event.locals.refreshToken = null;
	return json({ ok: true });
};
