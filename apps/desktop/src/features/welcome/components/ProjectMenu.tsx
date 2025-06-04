import { projectsService } from "@/services/projects";
import { Button, Menu } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import type { Dispatch, SetStateAction } from "react";
import { useProjects } from "../hooks/useProjects";

type Props = {
	projectId: string;
	openProjectId: string | null;
	setOpenProjectId: Dispatch<SetStateAction<string | null>>;
	openRenameModal: () => void;
};

export function ProjectMenu(props: Props) {
	const open = props.projectId === props.openProjectId;

	const { dispatch } = useProjects();
	const onOpenChange = (open: boolean) => {
		if (open) {
			props.setOpenProjectId(props.projectId);
		} else {
			props.setOpenProjectId(null);
		}
	};

	const onDelete = async () => {
		if (!props.openProjectId) return;
		await projectsService.deleteProject(props.openProjectId);
		const projects = await projectsService.loadAll();
		dispatch({
			type: "reload",
			payload: projects,
		});
	};

	const onRename = () => {
		props.setOpenProjectId(props.projectId);
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
