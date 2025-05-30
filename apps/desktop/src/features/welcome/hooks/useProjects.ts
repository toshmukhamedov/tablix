import { useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";

export const useProjects = () => {
	const ctx = useContext(ProjectContext);
	if (!ctx) throw new Error("useProjects must be used within ProjectProvider");
	return ctx;
};
