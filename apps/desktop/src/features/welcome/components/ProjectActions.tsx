import { projectsService } from "@/services/projects";
import { Box, Button, Heading, Stack, Text, Wrap } from "@chakra-ui/react";
import { IconFolder, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { NewProjectModal } from "./NewProjectModal";

export function ProjectActions() {
	const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

	const { dispatch } = useProjects();

	const onOpenClick = async () => {
		const path = await projectsService.getValidPath();
		if (!path) return;

		const name = path.split("/").at(-1);
		if (!name) return;

		await projectsService.addProject({
			name,
			path,
		});
		const projects = await projectsService.loadAll();
		dispatch({
			type: "reload",
			payload: projects,
		});
	};

	return (
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
						<Button size="md" rounded={"lg"} variant="outline" paddingY={6} onClick={onOpenClick}>
							<Box color="blue.500">
								<IconFolder />
							</Box>
						</Button>
						<Text textStyle="sm">Open</Text>
					</Stack>
				</Wrap>
			</Stack>
			<NewProjectModal open={newProjectDialogOpen} close={() => setNewProjectDialogOpen(false)} />
		</Stack>
	);
}
