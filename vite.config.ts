import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketServer } from "./src/lib/wsSearch";

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
