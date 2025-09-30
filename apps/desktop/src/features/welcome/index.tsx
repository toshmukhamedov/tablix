import { Flex } from "@mantine/core";
import { ProjectsProvider } from "../../context/ProjectsContext";
import { ProjectActions } from "./components/ProjectActions";
import { ProjectsList } from "./components/ProjectsList";

export function Welcome() {
	return (
		<Flex justify="center" h="100%">
			<ProjectsProvider>
				<ProjectActions />
				<ProjectsList />
			</ProjectsProvider>
		</Flex>
	);
}
