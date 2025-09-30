import { notifications as toasts } from "@mantine/notifications";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

export type Project = {
	id: string;
	name: string;
	path: string;
};

export type AddProject = {
	name: string;
	path: string;
};

export type EditProject = Omit<Project, "path">;
export type DeleteProject = Pick<Project, "id"> & {
	cleanup: boolean;
};

const showError = (...args: string[]) =>
	toasts.show({
		message: args.join(),
		color: "red",
	});
const getErrorMessage = (e: unknown) => {
	if (typeof e === "string") return e;
	return e instanceof Error ? e.message : "unknown error";
};

class ProjectCommands {
	constructor(private readonly homeDir: string | undefined) {}

	async loadAll() {
		return await invoke<Project[]>("list_projects");
	}

	async setActiveProject(projectId: string): Promise<void> {
		await invoke("set_project_active", { id: projectId });
	}

	async getProject(projectId: string, noValidation?: boolean): Promise<Project> {
		return await invoke("get_project", { id: projectId, noValidation });
	}

	async updateProject(project: EditProject): Promise<void> {
		await invoke("update_project", { project });
	}

	private async add(data: AddProject) {
		const project = await invoke("add_project", data);
		return project;
	}

	async deleteProject(data: DeleteProject) {
		await invoke("delete_project", data);
	}

	async promptForDirectory(): Promise<string | undefined> {
		const selectedPath = open({
			directory: true,
			recursive: true,
			defaultPath: this.homeDir,
		});
		if (selectedPath) {
			if (selectedPath === null) return;
			if (Array.isArray(selectedPath) && selectedPath.length !== 1) return;
			return Array.isArray(selectedPath) ? selectedPath[0] : await selectedPath;
		}
	}

	async addProject(input: AddProject): Promise<void> {
		const data: AddProject = {
			name: input.name,
			path: this.getAbsolutePath(input.path),
		};
		const project = await this.add(data);

		if (!project) return;
		toasts.show({
			color: "green",
			message: "Project added",
		});
	}

	async getValidPath(): Promise<string | undefined> {
		const path = await this.promptForDirectory();
		if (!path) return undefined;
		if (!this.validateProjectPath(path)) return undefined;
		return path;
	}

	getRelativePath(path: string): string {
		let newPath = path;
		if (this.homeDir) {
			newPath = path.replace(this.homeDir, "~");
		}
		return newPath;
	}
	getAbsolutePath(path: string): string {
		let newPath = path;
		if (this.homeDir && path.startsWith("~")) {
			newPath = path.replace("~", this.homeDir);
		}

		return newPath;
	}

	validateProjectPath(path: string) {
		if (/^\\\\wsl.localhost/i.test(path)) {
			const errorMsg =
				"For WSL2 projects, install the Linux version of GitButler inside of your WSL2 distro";
			console.error(errorMsg);
			showError("Use the Linux version of GitButler", errorMsg);

			return false;
		}

		if (/^\\\\/i.test(path)) {
			const errorMsg =
				"Using git across a network is not recommended. Either clone the repo locally, or use the NET USE command to map a network drive";
			console.error(errorMsg);
			showError("UNC Paths are not directly supported", errorMsg);

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

// FIXME
export const projectCommands = new ProjectCommands("/Users/abdugani");
