import { derived, writable } from 'svelte/store';
import { apiFetch, refreshTokenClient } from '$lib/utils/api';
import { cacheAccessToken, clearTokens, persistTokens } from './tokens';
import type { OtpVerifyResponse, SessionTokens, User } from '$lib/types';

type AuthActor = 'couple' | 'vendor';

const userStore = writable<User | null>(null);
export const user = userStore;
export const isAuthenticated = derived(userStore, ($user) => Boolean($user));

export const initAuth = (initialUser: User | null) => {
	userStore.set(initialUser);
};

export const requestOtp = async (phone: string, actor: AuthActor) => {
	return apiFetch<{ detail?: string; debug_code?: string }>('/api/auth/otp/request/', {
		method: 'POST',
		body: JSON.stringify({ phone, actor }),
		auth: false
	});
};

export const verifyOtp = async (
	phone: string,
	code: string,
	actor: AuthActor
): Promise<OtpVerifyResponse> => {
	const payload = await apiFetch<OtpVerifyResponse>('/api/auth/otp/verify/', {
		method: 'POST',
		body: JSON.stringify({ phone, code, actor }),
		auth: false
	});
	const tokens: SessionTokens = { access: payload.access, refresh: payload.refresh };
	await persistTokens(tokens);
	cacheAccessToken(payload.access);
	const mergedUser: User | undefined = payload.user
		? ({
				...payload.user,
				vendor_profile: payload.vendor_profile ?? payload.user.vendor_profile
			} as User)
		: undefined;
	if (mergedUser) {
		userStore.set(mergedUser);
	}
	return { ...payload, user: mergedUser };
};

export const fetchMeClient = async () => {
	const profile = await apiFetch<User>('/api/auth/me/', { auth: true });
	userStore.set(profile);
	return profile;
};

export const refreshSessionClient = async () => {
	const tokens = await refreshTokenClient();
	if (tokens?.access) {
		cacheAccessToken(tokens.access);
	}
	return tokens;
};

export const logout = async () => {
	await clearTokens();
	userStore.set(null);
};
