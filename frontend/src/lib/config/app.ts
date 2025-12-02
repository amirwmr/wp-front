import type { Locale } from '$lib/types';

export const APP_NAME = 'Wedding OS';
export const DEFAULT_LOCALE: Locale = 'fa';
export const SUPPORTED_LOCALES: Locale[] = ['fa', 'en'];
export const DEFAULT_THEME = 'light';
export const AUTH_COOKIE_NAMES = {
	access: 'access_token',
	refresh: 'refresh_token',
	locale: 'locale',
	theme: 'theme'
};
