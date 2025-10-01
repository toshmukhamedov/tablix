import { projectCommands } from "@/commands/project";
import { useProjects } from "@/context/ProjectsContext";
import { Button, Flex, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconFolder, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { NewProjectModal } from "./NewProjectModal";

export function ProjectActions() {
	const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
	const { dispatch } = useProjects();

	const onOpenClick = async () => {
		const path = await projectCommands.getValidPath();
		if (!path) return;

		const name = path.split("/").at(-1);
		if (!name) return;

		projectCommands
			.addProject({
				name,
				path,
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

	return (
		<Stack flex="3" justify="center" bg="dark.9">
			<Stack align="center">
				<Title size="h2" fw="500">
					Welcome to Tablix
				</Title>
				<Text size="sm" fw="500" py={4} ta="center" c="gray.3">
					Create a new project to start from scratch.
					<br />
					Open existing project from disk.
				</Text>
				<Flex justify="center" align={"center"} gap="lg" py="lg">
					<Stack align={"center"} gap="xs">
						<Button
							size="lg"
							radius="md"
							variant="light"
							p="sm"
							onClick={() => setNewProjectDialogOpen(true)}
						>
							<IconPlus />
						</Button>
						<Text size="sm">New</Text>
					</Stack>
					<Stack align="center" gap="xs">
						<Button size="lg" radius="md" variant="light" p="sm" onClick={onOpenClick}>
							<IconFolder />
						</Button>
						<Text size="sm">Open</Text>
					</Stack>
				</Flex>
			</Stack>
			<NewProjectModal open={newProjectDialogOpen} close={() => setNewProjectDialogOpen(false)} />
		</Stack>
	);
}
