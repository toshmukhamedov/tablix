import { type Project, projectsService } from "@/services/projects";
import { Bleed, Box, Flex, Input, List, Separator, Stack, Text } from "@chakra-ui/react";
import { IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { ProjectMenu } from "../components/ProjectMenu";
import { useProjects } from "../hooks/useProjects";

export function ProjectsList() {
	const { state: projects } = useProjects();

	const [search, setSearch] = useState("");
	const [openMenuProjectId, setOpenMenuProjectId] = useState<string | null>(null);

	const filteredProjects: Project[] = useMemo(() => {
		const searchString = search.toLowerCase();
		return projects.filter((project) =>
			[project.name, project.path].some((item) => item.toLowerCase().indexOf(searchString) !== -1),
		);
	}, [search, projects]);
	return (
		<Stack flex="4" padding={4} height="dvh" bgColor={"gray.900"}>
			<Flex align={"center"} justify={"center"} marginTop={4}>
				<IconSearch size={16} />
				<Input
					autoCorrect="off"
					border={"none"}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search projects"
					className="search-input"
					outlineWidth={"0"}
				/>
			</Flex>
			<Separator size="md" marginY={2} />
			<List.Root variant={"plain"} overflowY="auto" scrollbar="hidden">
				{filteredProjects.map((project) => (
					<List.Item
						key={project.id}
						paddingX="2"
						paddingTop="2"
						rounded="md"
						cursor="pointer"
						_hover={{ bgColor: "gray.800" }}
					>
						<Bleed width="full">
							<Flex justify="space-between" align="center" width="full">
								<Box>
									<Text textStyle={"sm"} fontWeight={"medium"}>
										{project.name}
									</Text>
									<Text textStyle="xs" fontWeight={"medium"} color="white/60">
										{projectsService.getRelativePath(project.path)}
									</Text>
								</Box>
								<ProjectMenu
									projectId={project.id}
									setOpenProjectId={setOpenMenuProjectId}
									openProjectId={openMenuProjectId}
								/>
							</Flex>
							<Separator size="xs" marginTop={2} />
						</Bleed>
					</List.Item>
				))}
			</List.Root>
		</Stack>
	);
}
