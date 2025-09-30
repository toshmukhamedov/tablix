import { type Project, projectCommands } from "@/commands/project";
import { Flex, Space, Table, Text } from "@mantine/core";

import { useProjectContext } from "@/context/ProjectContext";
import { useProjects } from "@/context/ProjectsContext";
import { useView } from "@/context/ViewContext";
import { useMemo, useState } from "react";
import { ProjectMenu } from "../components/ProjectMenu";

type Props = {
	search: string;
	setEditingProject: React.Dispatch<React.SetStateAction<Project | null>>;
	openEditModal: () => void;
};

export const ProjectsTable: React.FC<Props> = ({
	search,
	setEditingProject: setRenamingProject,
	openEditModal: openRenameModal,
}) => {
	const { state } = useProjects();
	const { setProject } = useProjectContext();
	const { setView } = useView();

	const [activeProject, setActiveProject] = useState<Project | null>(null);

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

	return (
		<Table.ScrollContainer minWidth="max-content" scrollAreaProps={{ scrollbarSize: "0.5rem" }}>
			<Table highlightOnHoverColor="dark.4" highlightOnHover>
				<Table.Tbody>
					{projects.map((project) => (
						<Table.Tr key={project.id}>
							<Table.Td onClick={() => openProject(project)} style={{ cursor: "pointer" }}>
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
									<ProjectMenu
										currentProject={project}
										activeProject={activeProject}
										setActiveProject={setActiveProject}
										setEditingProject={setRenamingProject}
										openEditModal={openRenameModal}
									/>
								</Flex>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</Table.ScrollContainer>
	);
};
