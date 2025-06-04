import { Flex } from "@mantine/core";
import { ProjectActions } from "./components/ProjectActions";
import { ProjectsList } from "./components/ProjectsList";
import { ProjectContextProvider } from "./context/ProjectContextProvider";

export function Welcome() {
	return (
		<ProjectContextProvider>
			<Flex justify="center" h="100%">
				<ProjectActions />
				<ProjectsList />
			</Flex>
		</ProjectContextProvider>
	);
}
