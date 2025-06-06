export type KeyType = "gitCredentialsHelper" | "local" | "systemExecutable";
export type LocalKey = {
	local: { private_key_path: string };
};

export type Key = Exclude<KeyType, "local"> | LocalKey;

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
