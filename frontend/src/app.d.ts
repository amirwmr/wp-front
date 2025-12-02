// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/types').User | null;
			accessToken?: string | null;
			refreshToken?: string | null;
			locale?: import('$lib/types').Locale;
			theme?: 'light' | 'dark';
		}
		interface PageData {
			user: import('$lib/types').User | null;
			locale: import('$lib/types').Locale;
			theme: 'light' | 'dark';
			apiBase: string;
		}
	}
}

export {};
