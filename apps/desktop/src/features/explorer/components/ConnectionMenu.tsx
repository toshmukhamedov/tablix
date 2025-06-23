import { Popconfirm } from "@/components/PopConfirm";
import type { Connection } from "@/services/connections";
import { type DeleteProject, projectsService } from "@/services/projects";
import { Button, Checkbox, Menu } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction, useState } from "react";

type Props = {
	currentConnection: Connection;
	activeConnection: Connection | null;
	openEditModal: () => void;
	setActiveConnection: Dispatch<SetStateAction<Connection | null>>;
	setEditingConnection: Dispatch<SetStateAction<Connection | null>>;
};

export function ConnectionMenu(props: Props) {
	const open = props.currentConnection === props.activeConnection;

	const [cleanup, setCleanup] = useState(false);

	const onOpenChange = (open: boolean) => {
		if (open) {
			props.setActiveConnection(props.currentConnection);
		} else {
			props.setActiveConnection(null);
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
			props.setActiveConnection(null);
		},
	});

	const onDelete = async () => {
		if (!props.activeConnection) return;
		await mutation.mutateAsync({
			id: props.activeConnection.id,
			cleanup,
		});
	};

	const onEdit = () => {
		props.setEditingConnection(props.currentConnection);
		props.openEditModal();
		props.setActiveConnection(null);
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
