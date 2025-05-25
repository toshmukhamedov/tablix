import { ProjectsService } from '$lib/projects/projects-service';
import type { LayoutLoad } from './$types';
import { homeDir } from '@tauri-apps/api/path';

// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
export const prerender = true;
export const ssr = false;

// TODO: Find a workaround to avoid this dynamic import
// https://github.com/sveltejs/kit/issues/905
// const defaultPath = await (await import('@tauri-apps/api/path')).homeDir();

export const load: LayoutLoad = async () => {
	const projectsService = new ProjectsService(await homeDir());

	return {
		projectsService,
	};
};
