import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:8000",
			},
		},
	},
	define: {
		global: 'globalThis', // Use globalThis instead of global
	},
	resolve: {
		alias: {
		  stream: 'stream-browserify',
		},
	  },
});
