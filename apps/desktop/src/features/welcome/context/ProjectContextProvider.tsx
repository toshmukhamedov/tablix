import { projectsService } from "@/services/projects";
import { type ReactNode, useEffect, useReducer } from "react";
import { type ProjectAction, ProjectContext, type ProjectContextType } from "./ProjectContext";

function projectReducer(state: ProjectContextType["state"], action: ProjectAction) {
	switch (action.type) {
		case "add": {
			return [...state, action.payload];
		}
		case "reload": {
			return action.payload;
		}
	}
}

type ProjectContextProviderProps = {
	children: ReactNode;
};
export function ProjectContextProvider({ children }: ProjectContextProviderProps) {
	const [state, dispatch] = useReducer(projectReducer, []);

	useEffect(() => {
		projectsService.loadAll().then((projects) => {
			dispatch({
				type: "reload",
				payload: projects,
			});
		});
	}, []);

	return <ProjectContext.Provider value={{ state, dispatch }}>{children}</ProjectContext.Provider>;
}
