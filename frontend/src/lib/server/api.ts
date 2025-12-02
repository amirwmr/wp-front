import type { RequestEvent } from '@sveltejs/kit';
import type { SessionTokens, User } from '$lib/types';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

export const API_BASE =
	process.env.API_INTERNAL_BASE_URL || PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchMe = async (event: RequestEvent, accessToken: string) => {
	try {
		const res = await event.fetch(`${API_BASE}/api/auth/me/`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		if (!res.ok) return null;
		const user = (await res.json()) as User;
		return user;
	} catch {
		return null;
	}
};

export const refreshSessionTokens = async (
	event: RequestEvent,
	refreshToken: string
): Promise<SessionTokens | null> => {
	try {
		const res = await event.fetch(`${API_BASE}/api/auth/jwt/refresh/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh: refreshToken })
		});
		if (!res.ok) return null;
		const data = (await res.json()) as SessionTokens;
		return data;
	} catch {
		return null;
	}
};
