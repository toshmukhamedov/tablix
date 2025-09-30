import { ConnectionsProvider } from "@/context/ConnectionsContext";
import { useProject } from "@/context/ProjectContext";
import { useView } from "@/context/ViewContext";
import { Split } from "@gfazioli/mantine-split-pane";
import { Center, Paper, Stack } from "@mantine/core";
import { Editor } from "../editor/Editor";
import { Explorer } from "../explorer";
import { Menubar } from "./components/Menubar";

export function Workspace() {
	const { project } = useProject();
	const { setView } = useView();

	if (!project) {
		setView("welcome");
		return;
	}

	return (
		<ConnectionsProvider>
			<Stack gap="0" h="100%">
				<Menubar />
				<Split size="1px" h="100%" spacing="0" opacity="0">
					<Split.Pane maxWidth="50%" initialWidth="25%" minWidth="15%">
						<Explorer />
					</Split.Pane>
					<Split.Resizer />
					<Split.Pane w="100%">
						<Paper w="100%" h="100%" p="xs">
							<Editor />
						</Paper>
					</Split.Pane>
				</Split>
			</Stack>
		</ConnectionsProvider>
	);
}
