import { Popconfirm } from "@/components/PopConfirm";
import { type DeleteProject, type Project, projectsService } from "@/services/projects";
import { Button, Checkbox, Menu } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction, useState } from "react";

type Props = {
	currentProject: Project;
	activeProject: Project | null;
	openEditModal: () => void;
	setActiveProject: Dispatch<SetStateAction<Project | null>>;
	setEditingProject: Dispatch<SetStateAction<Project | null>>;
};

export function ProjectMenu(props: Props) {
	const open = props.currentProject === props.activeProject;

	const [cleanup, setCleanup] = useState(false);

	const onOpenChange = (open: boolean) => {
		if (open) {
			props.setActiveProject(props.currentProject);
		} else {
			props.setActiveProject(null);
		}
	};

	const queryClient = useQueryClient();
	const mutation = useMutation<void, string, DeleteProject>({
		mutationFn: projectsService.deleteProject,
		onError: (message) =>
			notifications.show({
				message,
				color: "red",
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			props.setActiveProject(null);
		},
	});

	const onDelete = async () => {
		if (!props.activeProject) return;
		await mutation.mutateAsync({
			id: props.activeProject.id,
			cleanup,
		});
	};

	const onEdit = () => {
		props.setEditingProject(props.currentProject);
		props.openEditModal();
		props.setActiveProject(null);
	};

	return (
		<Menu
			opened={open}
			onChange={onOpenChange}
			closeOnItemClick={false}
			closeOnClickOutside={false}
		>
			<Menu.Target>
				<Button variant="transparent" c="dark.1" size="compact-sm" p="unset">
					<IconDotsVertical />
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item onClick={onEdit} leftSection={<IconEdit size={14} />}>
					Edit
				</Menu.Item>
				<Popconfirm
					onConfirm={onDelete}
					title="Are you sure to delete this project?"
					content={
						<Checkbox
							label="Also clean up files"
							size="xs"
							checked={cleanup}
							onChange={(event) => setCleanup(event.currentTarget.checked)}
						/>
					}
				>
					<Menu.Item color="red" leftSection={<IconTrash size={14} />}>
						Delete...
					</Menu.Item>
				</Popconfirm>
			</Menu.Dropdown>
		</Menu>
	);
}
