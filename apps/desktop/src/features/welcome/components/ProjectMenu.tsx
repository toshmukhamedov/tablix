import { toaster } from "@/components/ui/toaster";
import { Ms } from "@/lib/utils/time";
import { projectsService } from "@/services/projects";
import { Button, Menu, Portal } from "@chakra-ui/react";
import { IconDotsVertical } from "@tabler/icons-react";
import type { Dispatch, SetStateAction } from "react";
import { useProjects } from "../hooks/useProjects";

type Props = {
	projectId: string;
	openProjectId: string | null;
	setOpenProjectId: Dispatch<SetStateAction<string | null>>;
};

type ItemValue = "rename" | "delete";

export function ProjectMenu(props: Props) {
	const open = props.projectId === props.openProjectId;

	const { dispatch } = useProjects();
	const onOpenChange: Menu.RootProps["onOpenChange"] = (details) => {
		if (details.open) {
			props.setOpenProjectId(props.projectId);
		} else {
			props.setOpenProjectId(null);
		}
	};

	const onSelect: Menu.RootProps["onSelect"] = async (details) => {
		if (!props.openProjectId) return;
		switch (details.value as ItemValue) {
			case "delete": {
				await projectsService.deleteProject(props.openProjectId);
				const projects = await projectsService.loadAll();
				dispatch({
					type: "reload",
					payload: projects,
				});
				break;
			}
			default: {
				toaster.warning({
					title: "Not supported yet",
					duration: Ms.seconds(1),
				});
				break;
			}
		}
	};
	return (
		<Menu.Root open={open} onOpenChange={onOpenChange} onSelect={onSelect}>
			<Menu.Trigger asChild>
				<Button variant="plain" outline="none" size="sm" padding="unset">
					<IconDotsVertical />
				</Button>
			</Menu.Trigger>
			<Portal>
				<Menu.Positioner>
					<Menu.Content>
						<Menu.Item value="rename">Rename</Menu.Item>
						<Menu.Item
							value="delete"
							color="fg.error"
							_hover={{ bg: "bg.error", color: "fg.error" }}
						>
							Delete...
						</Menu.Item>
					</Menu.Content>
				</Menu.Positioner>
			</Portal>
		</Menu.Root>
	);
}
