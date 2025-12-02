import { browser } from '$app/environment';
import { DEFAULT_THEME, AUTH_COOKIE_NAMES } from '$lib/config/app';
import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

const applyThemeToDom = (value: Theme) => {
	if (!browser) return;
	const root = document.documentElement;
	root.dataset.theme = value;
	root.classList.toggle('dark', value === 'dark');
	document.cookie = `${AUTH_COOKIE_NAMES.theme}=${value}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
	localStorage.setItem('theme', value);
};

function createThemeStore() {
	const { subscribe, set, update } = writable<Theme>(DEFAULT_THEME);

	return {
		subscribe,
		init: (initial?: Theme) => {
			const stored = browser ? (localStorage.getItem('theme') as Theme | null) : null;
			const value = initial ?? stored ?? DEFAULT_THEME;
			set(value);
			applyThemeToDom(value);
		},
		set: (value: Theme) => {
			set(value);
			applyThemeToDom(value);
		},
		toggle: () =>
			update((current) => {
				const next: Theme = current === 'dark' ? 'light' : 'dark';
				applyThemeToDom(next);
				return next;
			})
	};
}

export const theme = createThemeStore();
