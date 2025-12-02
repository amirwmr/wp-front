import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: 'src',
			filename: 'service-worker.js',
			strategies: 'generateSW',
			registerType: 'autoUpdate',
			manifest: {
				name: 'Wedding OS',
				short_name: 'WeddingOS',
				start_url: '/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#f46d9b',
				icons: [
					{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
				]
			},
			workbox: {
				globDirectory: '.svelte-kit/output/client',
				globPatterns: ['**/*.{js,css,ico,png,svg,webp,webmanifest,html,json}'],
				globIgnores: ['**/service-worker.js', '**/workbox-*.js'],
				navigateFallback: '/'
			},
			devOptions: { enabled: true }
		})
	]
});
