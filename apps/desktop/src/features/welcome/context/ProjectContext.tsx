import type { Project } from "@/services/projects";
import { type ActionDispatch, createContext } from "react";

export type ProjectAction =
	| {
			type: "add";
			payload: Project;
	  }
	| {
			type: "reload";
			payload: Project[];
	  };

export type ProjectContextType = {
	state: Project[];
	dispatch: ActionDispatch<[action: ProjectAction]>;
};
export const ProjectContext = createContext<ProjectContextType | null>(null);
