import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '$lib/config/app';
import type { Locale } from '$lib/types';
import { derived, writable } from 'svelte/store';
import en from './en.json';
import fa from './fa.json';

const flat = (obj: Record<string, unknown>, prefix = ''): Record<string, string> => {
	return Object.entries(obj).reduce(
		(acc, [key, value]) => {
			const path = prefix ? `${prefix}.${key}` : key;
			if (value && typeof value === 'object' && !Array.isArray(value)) {
				Object.assign(acc, flat(value as Record<string, unknown>, path));
			} else {
				acc[path] = String(value);
			}
			return acc;
		},
		{} as Record<string, string>
	);
};

const flatDicts: Record<Locale, Record<string, string>> = {
	en: flat(en),
	fa: flat(fa)
};

const locale = writable<Locale>(DEFAULT_LOCALE);

const translate = derived(locale, ($locale) => {
	const dict = flatDicts[$locale] ?? flatDicts[DEFAULT_LOCALE];
	return (key: string) => dict[key] ?? key;
});

export const _ = translate;
export const i18nLocale = locale;

export const setupI18n = (initial?: Locale) => {
	const target =
		initial && SUPPORTED_LOCALES.includes(initial) ? initial : (DEFAULT_LOCALE as Locale);
	locale.set(target);
};
