import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),

		alias: {
			$styles: "./src/styles/"
		},
		csp: {
			directives: {
				'default-src': ['self'],
				// https://github.com/sveltejs/kit/issues/5215 :/
				'style-src': ['self', 'unsafe-inline'],
				'script-src-attr': ['unsafe-hashes', 'sha256-W26xCcw4HB/UzduZBkCFzwP4/RvbREjKiFGbKZz8r1w='],
			},
			mode: 'auto'
		},
	},
};

export default config;
