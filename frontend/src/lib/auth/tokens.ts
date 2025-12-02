import { browser } from '$app/environment';
import { AUTH_COOKIE_NAMES } from '$lib/config/app';
import type { SessionTokens } from '$lib/types';

const ACCESS_MAX_AGE = 60 * 5; // 5 minutes

const parseCookie = (key: string) => {
	if (!browser) return null;
	const match = document.cookie
		.split(';')
		.map((c) => c.trim())
		.find((c) => c.startsWith(`${key}=`));
	return match ? decodeURIComponent(match.split('=')[1]) : null;
};

const accessCookieString = (value: string, maxAge = ACCESS_MAX_AGE) => {
	if (!browser) return '';
	const secure = window.location.protocol === 'https:';
	return `${AUTH_COOKIE_NAMES.access}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax;${
		secure ? ' Secure' : ''
	}`;
};

export const persistTokens = async (tokens: SessionTokens) => {
	if (!browser) return;
	sessionStorage.setItem(AUTH_COOKIE_NAMES.access, tokens.access);
	const res = await fetch('/api/auth/session', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(tokens),
		credentials: 'include'
	});
	if (!res.ok) {
		sessionStorage.removeItem(AUTH_COOKIE_NAMES.access);
		throw new Error('Failed to persist session');
	}
	// Keep a non-HttpOnly access cookie client-side to survive reloads if the session endpoint is cached.
	document.cookie = accessCookieString(tokens.access);
};

export const clearTokens = async () => {
	if (!browser) return;
	sessionStorage.removeItem(AUTH_COOKIE_NAMES.access);
	document.cookie = accessCookieString('', 0);
	try {
		await fetch('/api/auth/session', { method: 'DELETE', credentials: 'include' });
	} catch (error) {
		console.error('Failed to clear auth cookies', error);
	}
};

export const getClientAccessToken = () => {
	if (!browser) return null;
	const cached = sessionStorage.getItem(AUTH_COOKIE_NAMES.access);
	if (cached) return cached;
	const cookie = parseCookie(AUTH_COOKIE_NAMES.access);
	if (cookie) {
		sessionStorage.setItem(AUTH_COOKIE_NAMES.access, cookie);
		return cookie;
	}
	return null;
};

export const getClientRefreshToken = () => {
	if (!browser) return null;
	return parseCookie(AUTH_COOKIE_NAMES.refresh);
};

export const cacheAccessToken = (access: string | null) => {
	if (!browser) return;
	if (access) {
		sessionStorage.setItem(AUTH_COOKIE_NAMES.access, access);
		document.cookie = accessCookieString(access);
	} else {
		sessionStorage.removeItem(AUTH_COOKIE_NAMES.access);
		document.cookie = accessCookieString('', 0);
	}
};
