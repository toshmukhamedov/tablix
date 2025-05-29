import { type Project, projectsService } from "@/services/projects";
import {
	Bleed,
	Box,
	Button,
	Flex,
	Heading,
	Input,
	List,
	Separator,
	Stack,
	Text,
	Wrap,
} from "@chakra-ui/react";
import { IconFolder, IconPlus, IconSearch } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { NewProjectModal } from "./NewProjectModal";

export function Welcome() {
	const [search, setSearch] = useState("");
	const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

	const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		projectsService.loadAll().then(setProjects);
	}, []);

	const filteredProjects: Project[] = useMemo(() => {
		const searchString = search.toLowerCase();
		return projects.filter((project) =>
			[project.name, project.path].some(
				(item) => item.toLowerCase().indexOf(searchString) !== -1,
			),
		);
	}, [search, projects]);

	return (
		<>
			<Flex justify={"center"}>
				<Stack flex="3" justify="center" height={"dvh"} bgColor={"gray.950"}>
					<Stack align="center">
						<Heading size="2xl">Welcome to Tablix</Heading>
						<Text
							textStyle="sm"
							fontWeight="medium"
							paddingY={4}
							textAlign={"center"}
							color={"gray.500"}
						>
							Create a new project to start from scratch.
							<br />
							Open existing project from disk.
						</Text>
						<Wrap justify="center" align={"center"} gap={6} paddingY="6">
							<Stack align={"center"}>
								<Button
									size="md"
									rounded={"lg"}
									variant="outline"
									paddingY={6}
									className="border-base-300 hover:border-primary"
									onClick={() => setNewProjectDialogOpen(true)}
								>
									<Box color="blue.500">
										<IconPlus />
									</Box>
								</Button>
								<Text textStyle="sm">New</Text>
							</Stack>
							<Stack align="center">
								<Button size="md" rounded={"lg"} variant="outline" paddingY={6}>
									<Box color="blue.500">
										<IconFolder />
									</Box>
								</Button>
								<Text textStyle="sm">Open</Text>
							</Stack>
						</Wrap>
					</Stack>
				</Stack>
				<Stack flex="4" padding={4} bgColor={"gray.900"}>
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
					<List.Root variant={"plain"}>
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
									<Text textStyle={"sm"} fontWeight={"medium"}>
										{project.name}
									</Text>
									<Text textStyle="xs" fontWeight={"medium"} color="white/60">
										{project.path}
									</Text>
									<Separator size="xs" marginTop={2} />
								</Bleed>
							</List.Item>
						))}
					</List.Root>
				</Stack>
			</Flex>
			<NewProjectModal
				open={newProjectDialogOpen}
				close={() => setNewProjectDialogOpen(false)}
			/>
		</>
	);
}
