import { type Project, projectCommands } from "@/commands/project";
import { createContext, useContext, useEffect, useReducer } from "react";

type ProjectsContextState = {
	projects: Project[];
};

type ProjectsContext = {
	state: ProjectsContextState;
	dispatch: React.Dispatch<ProjectsAction>;
};

const ProjectsContext = createContext<ProjectsContext | null>(null);

export type ProjectsAction = {
	type: "set";
	projects: Project[];
};

const reducer: React.Reducer<ProjectsContextState, ProjectsAction> = (_, action) => {
	switch (action.type) {
		case "set":
			return { projects: action.projects };
	}
};

type Props = {
	children: React.ReactNode;
};
export const ProjectsProvider: React.FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, { projects: [] });

	useEffect(() => {
		projectCommands.loadAll().then((projects) => dispatch({ type: "set", projects }));
	}, []);

	return (
		<ProjectsContext.Provider value={{ state, dispatch }}>{children}</ProjectsContext.Provider>
	);
};

export const useProjects = () => {
	const context = useContext(ProjectsContext);
	if (!context) {
		throw new Error("You should use this hook inside ProjectsProvider");
	}

	return context;
};
