import type { Project } from "@/commands/project";
import { useView } from "@/context/ViewContext";
import { createContext, useContext, useState } from "react";

type ProjectContext = {
	project: Project | null;
	setProject: React.Dispatch<Project | null>;
};
const ProjectContext = createContext<ProjectContext | null>(null);

type Props = {
	children: React.ReactNode;
};
export const ProjectProvider: React.FC<Props> = ({ children }) => {
	const [project, setProject] = useState<Project | null>(null);

	return (
		<ProjectContext.Provider value={{ project, setProject }}>{children}</ProjectContext.Provider>
	);
};

export const useProjectContext = () => {
	const context = useContext(ProjectContext);
	if (!context) {
		throw new Error("You should use this hook inside ProjectProvider");
	}

	return context;
};

export const useProject = () => {
	const context = useContext(ProjectContext);
	if (!context) {
		throw new Error("You should use this hook inside ProjectProvider");
	}
	const { project, setProject } = context;
	const { setView } = useView();
	if (!project) {
		setView("welcome");
		return {
			project: {} as Project,
			setProject,
		};
	}

	return { project, setProject };
};
