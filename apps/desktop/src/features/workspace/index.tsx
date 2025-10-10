import { Split, type SplitResizerProps } from "@gfazioli/mantine-split-pane";
import { Stack } from "@mantine/core";
import { ActiveConnectionProvider } from "@/context/ActiveConnectionContext";
import { ConnectionOutputProvider } from "@/context/ConnectionOutputContext";
import { ConnectionsProvider } from "@/context/ConnectionsContext";
import { DockTabsProvider } from "@/context/DockTabsContext";
import { MainTabsProvider } from "@/context/MainTabsContext";
import { OpenSectionsProvider, type Section, useOpenSections } from "@/context/OpenSectionsContext";
import { useProject } from "@/context/ProjectContext";
import { useView } from "@/context/ViewContext";
import { Explorer } from "../explorer";
import { Queries } from "../queries";
import { Dock } from "./components/Dock";
import { Main } from "./components/Main";
import { Menubar } from "./components/Menubar";

const getResizerProps = (): SplitResizerProps => ({
	color: "var(--mantine-color-dark-9)",
	hoverColor: "var(--mantine-color-dark-9)",
});

export function WorkspaceInner() {
	const { project } = useProject();
	const { setView } = useView();
	const { openSections } = useOpenSections();

	if (!project) {
		setView("welcome");
		return;
	}

	const getPaneStyles = (section: Section) => ({
		root: { display: openSections.has(section) ? "initial" : "none" },
	});

	return (
		<Stack gap="0" h="100%">
			<Menubar />
			<Split size="1px" w="100%" spacing="0" style={{ minHeight: 0, flex: 1 }}>
				<Split.Pane minWidth="200px" styles={getPaneStyles("explorer")}>
					<Explorer />
				</Split.Pane>
				<Split.Resizer {...getResizerProps()} />
				<Split.Pane grow>
					<Split size="1px" h="100%" spacing="0" orientation="horizontal">
						<Split.Pane grow>
							<Split size="1px" h="100%" spacing="0">
								<Split.Pane grow>
									<Main />
								</Split.Pane>
								<Split.Resizer {...getResizerProps()} />
								<Split.Pane minWidth="200px" styles={getPaneStyles("queries")}>
									<Queries />
								</Split.Pane>
							</Split>
						</Split.Pane>
						<Split.Resizer {...getResizerProps()} />
						<Split.Pane minHeight="150px" styles={getPaneStyles("dock")}>
							<Dock />
						</Split.Pane>
					</Split>
				</Split.Pane>
			</Split>
		</Stack>
	);
}

export const Workspace: React.FC = () => {
	return (
		<OpenSectionsProvider>
			<ConnectionsProvider>
				<ActiveConnectionProvider>
					<MainTabsProvider>
						<DockTabsProvider>
							<ConnectionOutputProvider>
								<WorkspaceInner />
							</ConnectionOutputProvider>
						</DockTabsProvider>
					</MainTabsProvider>
				</ActiveConnectionProvider>
			</ConnectionsProvider>
		</OpenSectionsProvider>
	);
};
