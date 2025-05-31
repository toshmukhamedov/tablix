import { Flex } from "@chakra-ui/react";
import { ProjectActions } from "./components/ProjectActions";
import { ProjectsList } from "./components/ProjectsList";
import { ProjectContextProvider } from "./context/ProjectContextProvider";

export function Welcome() {
	return (
		<ProjectContextProvider>
			<Flex justify={"center"}>
				<ProjectActions />
				<ProjectsList />
			</Flex>
		</ProjectContextProvider>
	);
}
