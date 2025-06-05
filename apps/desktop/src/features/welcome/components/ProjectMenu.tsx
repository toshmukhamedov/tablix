import { type Project, projectsService } from "@/services/projects";
import { Button, Menu } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import type { Dispatch, SetStateAction } from "react";
import { useProjects } from "../hooks/useProjects";

type Props = {
	currentProject: Project;
	activeProject: Project | null;
	openRenameModal: () => void;
	setActiveProject: Dispatch<SetStateAction<Project | null>>;
	setRenamingProject: Dispatch<SetStateAction<Project | null>>;
};

export function ProjectMenu(props: Props) {
	const open = props.currentProject === props.activeProject;

	const { dispatch } = useProjects();
	const onOpenChange = (open: boolean) => {
		if (open) {
			props.setActiveProject(props.currentProject);
		} else {
			props.setActiveProject(null);
		}
	};

	const onDelete = async () => {
		if (!props.activeProject) return;
		await projectsService.deleteProject(props.activeProject.id);
		const projects = await projectsService.loadAll();
		dispatch({
			type: "reload",
			payload: projects,
		});
	};

	const onRename = () => {
		props.setRenamingProject(props.currentProject);
		props.openRenameModal();
	};

	return (
		<Menu opened={open} onChange={onOpenChange}>
			<Menu.Target>
				<Button variant="subtle" c="dark.0" size="sm" p="unset">
					<IconDotsVertical />
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item onClick={onRename}>Rename</Menu.Item>
				<Menu.Item color="red" onClick={onDelete}>
					Delete...
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
}
