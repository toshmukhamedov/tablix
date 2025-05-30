import { Box, Button, Flex, Heading, Stack, Text, Wrap } from "@chakra-ui/react";
import { IconFolder, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { NewProjectModal } from "./components/NewProjectModal";
import { ProjectsList } from "./components/ProjectsList";
import { ProjectContextProvider } from "./context/ProjectContextProvider";

export function Welcome() {
	const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

	return (
		<ProjectContextProvider>
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
				<ProjectsList />
			</Flex>
			<NewProjectModal open={newProjectDialogOpen} close={() => setNewProjectDialogOpen(false)} />
		</ProjectContextProvider>
	);
}
