import { resolve } from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
	plugins: [TanStackRouterVite({ target: "react", autoCodeSplitting: true }), react()],

	resolve: {
		alias: {
			"@": resolve(import.meta.dirname, "src"),
			"@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
		},
	},

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ["**/crates/**"],
		},
	},
}));
