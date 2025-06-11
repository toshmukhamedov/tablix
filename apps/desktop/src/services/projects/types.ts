export class Project {
	id!: string;
	name!: string;
	path!: string;
}

export type AddProject = {
	name: string;
	path: string;
};

export type EditProject = Omit<Project, "path">;
export type DeleteProject = Pick<Project, "id"> & {
	cleanup: boolean;
};
