import { browser } from '$app/environment';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { cacheAccessToken, clearTokens, getClientAccessToken } from '$lib/auth/tokens';
import type { SessionTokens } from '$lib/types';

const API_BASE = PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface ApiOptions extends RequestInit {
	auth?: boolean;
}

export const apiFetch = async <T>(path: string, options: ApiOptions = {}) => {
	const headers = new Headers(options.headers ?? {});
	const authEnabled = options.auth ?? true;

	if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
		headers.set('Content-Type', 'application/json');
	}

	let accessToken: string | null = null;
	if (authEnabled) {
		accessToken = getClientAccessToken();
		if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
	}

	const makeRequest = async () => fetch(`${API_BASE}${path}`, { ...options, headers });

	let res: Response;
	try {
		res = await makeRequest();
	} catch {
		throw new Error('Network error. Please try again.');
	}

	if (authEnabled && res.status === 401 && browser) {
		const refreshed = await refreshTokenClient();
		if (refreshed) {
			accessToken = refreshed.access;
			headers.set('Authorization', `Bearer ${accessToken}`);
			res = await makeRequest();
		} else {
			await clearTokens();
			throw new Error('Session expired. Please log in again.');
		}
	}

	if (!res.ok) {
		const message = await safeErrorMessage(res);
		throw new Error(message);
	}

	const contentType = res.headers.get('content-type');
	if (contentType?.includes('application/json')) {
		return (await res.json()) as T;
	}
	return (await res.text()) as T;
};

const safeErrorMessage = async (res: Response) => {
	try {
		const data = await res.json();
		if (typeof data === 'string') return data;
		if (data?.detail) {
			return Array.isArray(data.detail) ? data.detail.join(' ') : data.detail;
		}
		if (data?.message) return data.message;
		const firstValue = Object.values(data ?? {})[0];
		if (Array.isArray(firstValue)) return String(firstValue[0]);
		if (typeof firstValue === 'string') return firstValue;
		return res.statusText;
	} catch {
		return res.statusText;
	}
};

export const refreshTokenClient = async (): Promise<SessionTokens | null> => {
	if (!browser) return null;
	const res = await fetch('/api/auth/refresh', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	});
	if (!res.ok) return null;
	const tokens = (await res.json()) as SessionTokens;
	cacheAccessToken(tokens.access);
	return tokens;
};
