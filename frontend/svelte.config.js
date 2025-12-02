import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const IGNORE_CODES = ['state_referenced_locally'];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	onwarn: (warning, handler) => {
		if (
			IGNORE_CODES.includes(warning.code) &&
			warning.filename?.includes('.svelte-kit/generated/root.svelte')
		) {
			return;
		}
		handler(warning);
	},

	kit: {
		adapter: adapter()
	}
};

export default config;
