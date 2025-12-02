import { browser } from '$app/environment';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, AUTH_COOKIE_NAMES } from '$lib/config/app';
import type { Locale } from '$lib/types';
import { derived, writable } from 'svelte/store';

const applyLocale = (value: Locale) => {
	if (!browser) return;
	document.documentElement.lang = value;
	document.documentElement.dir = value === 'fa' ? 'rtl' : 'ltr';
	localStorage.setItem('locale', value);
	document.cookie = `${AUTH_COOKIE_NAMES.locale}=${value}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
};

function createLocaleStore() {
	const { subscribe, set } = writable<Locale>(DEFAULT_LOCALE);

	return {
		subscribe,
		set: (value: Locale) => {
			set(value);
			applyLocale(value);
		},
		init: (initial?: Locale) => {
			const stored = browser ? (localStorage.getItem('locale') as Locale | null) : null;
			const value = initial ?? stored ?? DEFAULT_LOCALE;
			set(value);
			applyLocale(value);
		}
	};
}

export const locale = createLocaleStore();
export const direction = derived(locale, ($locale) => ($locale === 'fa' ? 'rtl' : 'ltr'));
export const isLocaleSupported = (code: Locale) => SUPPORTED_LOCALES.includes(code);
