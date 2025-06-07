import { Workspace } from "@/features/workspace";
import { projectsService } from "@/services/projects";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workspace/$projectId")({
	component: Workspace,
	loader: ({ params }) => {
		return projectsService.getProject(params.projectId);
	},
});
