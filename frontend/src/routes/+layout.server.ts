import {
	AUTH_COOKIE_NAMES,
	DEFAULT_LOCALE,
	DEFAULT_THEME,
	SUPPORTED_LOCALES
} from '$lib/config/app';
import type { LayoutServerLoad } from './$types';
import type { Locale } from '$lib/types';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

export const load: LayoutServerLoad = async (event) => {
	const rawLocale = event.cookies.get(AUTH_COOKIE_NAMES.locale) as Locale | undefined;
	const localeCookie =
		rawLocale && SUPPORTED_LOCALES.includes(rawLocale) ? rawLocale : DEFAULT_LOCALE;
	const themeCookie =
		(event.cookies.get(AUTH_COOKIE_NAMES.theme) as 'light' | 'dark' | undefined) ?? DEFAULT_THEME;

	event.locals.locale = localeCookie;
	event.locals.theme = themeCookie;

	return {
		user: event.locals.user ?? null,
		locale: localeCookie,
		theme: themeCookie,
		apiBase: PUBLIC_API_BASE_URL || 'http://localhost:8000'
	};
};
