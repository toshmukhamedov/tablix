import { Button, Flex, Space, Table, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical } from "@tabler/icons-react";
import { Menu } from "@tauri-apps/api/menu";
import { useMemo } from "react";
import { type Project, projectCommands } from "@/commands/project";
import { useProjectContext } from "@/context/ProjectContext";
import { useProjects } from "@/context/ProjectsContext";
import { useView } from "@/context/ViewContext";

type Props = {
	search: string;
	setEditingProject: React.Dispatch<React.SetStateAction<Project | null>>;
	openEditModal: () => void;
};

export const ProjectsTable: React.FC<Props> = ({ search, setEditingProject, openEditModal }) => {
	const { state, dispatch } = useProjects();
	const { setProject } = useProjectContext();
	const { setView } = useView();

	const projects: Project[] = useMemo(() => {
		const searchString = search.toLowerCase();
		return state.projects.filter((project) =>
			[project.name, project.path].some((item) => item.toLowerCase().indexOf(searchString) !== -1),
		);
	}, [search, state.projects]);

	const openProject = (project: Project) => {
		setProject(project);
		setView("workspace");
	};

	const onDelete = (project: Project) => {
		projectCommands
			.deleteProject({
				id: project.id,
				cleanup: false,
			})
			.then(() => {
				projectCommands.loadAll().then((projects) => dispatch({ type: "set", projects }));
			})
			.catch((message) => {
				notifications.show({
					message,
					color: "red",
				});
			});
	};

	const onEdit = (project: Project) => {
		setEditingProject(project);
		openEditModal();
	};

	const onContextMenu = async (e: React.MouseEvent, project: Project) => {
		e.preventDefault();
		const menu = await Menu.new({
			items: [
				{
					text: "Edit",
					action: () => onEdit(project),
				},
				{
					text: "Delete",
					action: () => onDelete(project),
				},
			],
		});
		await menu.popup();
	};

	return (
		<Table.ScrollContainer minWidth="max-content" scrollAreaProps={{ scrollbarSize: "0.5rem" }}>
			<Table highlightOnHoverColor="dark.6" highlightOnHover>
				<Table.Tbody>
					{projects.map((project) => (
						<Table.Tr key={project.id} onContextMenu={(e) => onContextMenu(e, project)}>
							<Table.Td onClick={() => openProject(project)}>
								<Text size={"sm"} fw="500">
									{project.name}
								</Text>
								<Space h="4px" />
								<Text size="xs" fw="500" opacity="60%">
									{projectCommands.getRelativePath(project.path)}
								</Text>
							</Table.Td>
							<Table.Td>
								<Flex justify="end" mr="sm">
									<Button
										variant="transparent"
										c="dark.1"
										size="compact-sm"
										p="unset"
										onClick={(e) => onContextMenu(e, project)}
									>
										<IconDotsVertical />
									</Button>
								</Flex>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</Table.ScrollContainer>
	);
};
