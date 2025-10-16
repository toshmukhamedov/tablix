import { notifications as toasts } from "@mantine/notifications";
import { invoke } from "@tauri-apps/api/core";
import { homeDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { error } from "@tauri-apps/plugin-log";

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
export type DeleteProject = Pick<Project, "id">;

class ProjectCommands {
	constructor(private readonly homeDir: string | undefined) {}

	async loadAll() {
		return await invoke<Project[]>("list_projects");
	}

	async setActiveProject(projectId: string): Promise<void> {
		await invoke("set_project_active", { id: projectId });
	}

	async getProject(projectId: string): Promise<Project> {
		return await invoke("get_project", { id: projectId });
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

	async promptForDirectory(): Promise<string | null> {
		try {
			const selectedPath = await open({
				directory: true,
				recursive: true,
				defaultPath: this.homeDir,
			});

			return selectedPath;
		} catch (e) {
			error(`[promptForDirectory] ${e}`);
			return null;
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

	async getValidPath(): Promise<string | null> {
		const path = await this.promptForDirectory();
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

	async close(): Promise<void> {
		await invoke("close_project");
	}
}

const homeDirPath = await homeDir();
export const projectCommands = new ProjectCommands(homeDirPath);
