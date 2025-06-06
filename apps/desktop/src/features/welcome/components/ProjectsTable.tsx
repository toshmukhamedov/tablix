import { SkeletonTable } from "@/components/SkeletonTable";
import { Route } from "@/routes/workspace/$projectId";
import { type Project, projectsService } from "@/services/projects";
import { Flex, Space, Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
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
	const navigate = useNavigate();

	const query = useQuery({ queryKey: ["projects"], queryFn: projectsService.loadAll });

	const [activeProject, setActiveProject] = useState<Project | null>(null);

	const projects: Project[] = useMemo(() => {
		if (!query.data) return [];
		const searchString = search.toLowerCase();
		return query.data.filter((project) =>
			[project.name, project.path].some((item) => item.toLowerCase().indexOf(searchString) !== -1),
		);
	}, [search, query.data]);

	if (query.isLoading) return <SkeletonTable />;

	const openProject = (projectId: string) => {
		navigate({ to: Route.to, params: { projectId } });
	};

	return (
		<Table.ScrollContainer minWidth="max-content" scrollAreaProps={{ scrollbarSize: "0.5rem" }}>
			<Table highlightOnHoverColor="dark.4" highlightOnHover>
				<Table.Tbody>
					{projects.map((project) => (
						<Table.Tr key={project.id}>
							<Table.Td onClick={() => openProject(project.id)} style={{ cursor: "pointer" }}>
								<Text size={"sm"} fw="500">
									{project.name}
								</Text>
								<Space h="4px" />
								<Text size="xs" fw="500" opacity="60%">
									{projectsService.getRelativePath(project.path)}
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
