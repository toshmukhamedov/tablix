import { Split } from "@gfazioli/mantine-split-pane";
import { Stack } from "@mantine/core";
import { ConnectionsProvider } from "@/context/ConnectionsContext";
import { useProject } from "@/context/ProjectContext";
import { useView } from "@/context/ViewContext";
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
				<Split size="1px" w="100%" spacing="0" opacity="0" style={{ minHeight: 0, flex: 1 }}>
					<Split.Pane maxWidth="50%" minWidth="25%">
						<Explorer />
					</Split.Pane>
					<Split.Resizer />
					<Split.Pane grow>
						<Editor />
					</Split.Pane>
				</Split>
			</Stack>
		</ConnectionsProvider>
	);
}
