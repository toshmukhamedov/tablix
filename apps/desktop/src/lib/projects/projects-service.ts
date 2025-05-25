import { Project, type AddProject } from './project';
import { sleep } from '$lib/utils/sleep';
import { open } from '@tauri-apps/plugin-dialog';
import { plainToInstance } from 'class-transformer';
import { derived, writable, type Readable } from 'svelte/store';
import { goto } from '$app/navigation';
import { invoke } from '@tauri-apps/api/core';
import * as toasts from '$lib/toasts';

const showError = console.error;
const getErrorMessage = (e: unknown) => {
	if (typeof e === 'string') return e;
	return e instanceof Error ? e.message : 'unknown error';
};

export class ProjectsService {
	readonly projects = writable<Project[] | undefined>(undefined, (set) => {
		(async () => {
			await sleep(100);
			try {
				const projects = await this.loadAll();
				this.error.set(undefined);
				set(projects);
			} catch (err) {
				this.error.set(err);
				showError('Failed to load projects', err);
			}
		})();
	});
	readonly error = writable();

	constructor(private homeDir: string | undefined) {}

	private async loadAll() {
		return await invoke<Project[]>('list_projects').then((p) => plainToInstance(Project, p));
	}

	async reload(): Promise<void> {
		this.projects.set(await this.loadAll());
	}

	async setActiveProject(projectId: string): Promise<void> {
		await invoke('set_project_active', { id: projectId });
		await this.reload();
	}

	async getProject(projectId: string, noValidation?: boolean) {
		return plainToInstance(Project, await invoke('get_project', { id: projectId, noValidation }));
	}

	#projectStores = new Map<string, Readable<Project | undefined>>();
	getProjectStore(projectId: string) {
		let store = this.#projectStores.get(projectId);
		if (store) return store;

		store = derived(this.projects, (projects) => {
			return projects?.find((p) => p.id === projectId);
		});
		this.#projectStores.set(projectId, store);
		return store;
	}

	async updateProject(project: Project & { unset_bool?: boolean }) {
		await invoke('update_project', { project: project });
		await this.reload();
	}

	async add(data: AddProject) {
		const project = plainToInstance(Project, await invoke('add_project', data));
		await this.reload();
		return project;
	}

	async deleteProject(id: string) {
		await invoke('delete_project', { id });
		await this.reload();
	}

	async promptForDirectory(): Promise<string | undefined> {
		const selectedPath = open({ directory: true, recursive: true, defaultPath: this.homeDir });
		if (selectedPath) {
			if (selectedPath === null) return;
			if (Array.isArray(selectedPath) && selectedPath.length !== 1) return;
			return Array.isArray(selectedPath) ? selectedPath[0] : await selectedPath;
		}
	}

	async openProjectInNewWindow(projectId: string) {
		await invoke('open_project_in_window', { id: projectId });
	}

	async relocateProject(projectId: string): Promise<void> {
		const path = await this.getValidPath();
		if (!path) return;

		try {
			const project = await this.getProject(projectId, true);
			project.path = path;
			await this.updateProject(project);
			toasts.success(`Project ${project.name} relocated`);

			goto(`/${project.id}/board`);
		} catch (e) {
			showError('Failed to relocate project:', getErrorMessage(e));
		}
	}

	async addProject(data: AddProject) {
		try {
			data.path = this.getAbsolutePath(data.path);
			const project = await this.add(data);
			if (!project) return;
			toasts.success(`Project ${project.name} created`);
			// linkProjectModal?.show(project.id);
			// goto(`/${project.id}/board`);
		} catch (e) {
			showError('There was an error while adding project', getErrorMessage(e));
		}
	}

	async getValidPath(): Promise<string | undefined> {
		const path = await this.promptForDirectory();
		if (!path) return undefined;
		if (!this.validateProjectPath(path)) return undefined;
		return path;
	}

	getRelativePath(path: string): string {
		if (this.homeDir) {
			path = path.replace(this.homeDir, '~');
		}
		return path;
	}
	getAbsolutePath(path: string): string {
		if (this.homeDir && path.startsWith('~')) {
			path = path.replace('~', this.homeDir);
		}

		return path;
	}

	validateProjectPath(path: string) {
		if (/^\\\\wsl.localhost/i.test(path)) {
			const errorMsg =
				'For WSL2 projects, install the Linux version of GitButler inside of your WSL2 distro';
			console.error(errorMsg);
			showError('Use the Linux version of GitButler', errorMsg);

			return false;
		}

		if (/^\\\\/i.test(path)) {
			const errorMsg =
				'Using git across a network is not recommended. Either clone the repo locally, or use the NET USE command to map a network drive';
			console.error(errorMsg);
			showError('UNC Paths are not directly supported', errorMsg);

			return false;
		}

		return true;
	}

	// getLastOpenedProject() {
	// 	return get(this.persistedId);
	// }

	// setLastOpenedProject(projectId: string) {
	// 	this.persistedId.set(projectId);
	// }
}
