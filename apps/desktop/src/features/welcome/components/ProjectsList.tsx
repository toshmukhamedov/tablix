import { type Project, projectsService } from "@/services/projects";
import { Divider, Flex, Space, Stack, Table, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { ProjectMenu } from "../components/ProjectMenu";
import { useProjects } from "../hooks/useProjects";
import { EditProjectModal } from "./EditProjectModal";

export function ProjectsList() {
	const { state: projects } = useProjects();

	const [opened, handlers] = useDisclosure(false);

	const [search, setSearch] = useState("");
	const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

	const filteredProjects: Project[] = useMemo(() => {
		const searchString = search.toLowerCase();
		return projects.filter((project) =>
			[project.name, project.path].some((item) => item.toLowerCase().indexOf(searchString) !== -1),
		);
	}, [search, projects]);

	const renameModalClose = () => {
		handlers.close();
		setActiveProjectId(null);
	};

	return (
		<Stack flex="4" p="md" gap="sm" bg="dark.7">
			<TextInput
				autoCorrect="off"
				mt="xs"
				leftSection={<IconSearch size={16} />}
				variant="unstyled"
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Search projects"
				fw="500"
			/>
			<Divider size="sm" my={2} />
			<Table.ScrollContainer minWidth="max-content" scrollAreaProps={{ scrollbarSize: "0.5rem" }}>
				<Table>
					<Table.Tbody>
						{filteredProjects.map((project) => (
							<Table.Tr key={project.id} style={{ borderRadius: "25px" }}>
								<Table.Td>
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
											projectId={project.id}
											setOpenProjectId={setActiveProjectId}
											openProjectId={activeProjectId}
											openRenameModal={handlers.open}
										/>
									</Flex>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
			<EditProjectModal open={opened} close={renameModalClose} projectId={activeProjectId} />
		</Stack>
	);
}
