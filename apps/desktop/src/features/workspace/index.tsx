import { Split, type SplitResizerProps } from "@gfazioli/mantine-split-pane";
import { Stack } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { DockTabsProvider } from "@/context/DockTabsContext";
import { useProject } from "@/context/ProjectContext";
import { platform } from "@/lib/platform";
import { appStore, type Section } from "@/stores/appStore";
import { Explorer } from "../explorer";
import { Queries } from "../queries";
import { Dock } from "./components/Dock";
import { Main } from "./components/Main";
import { Menubar } from "./components/Menubar";

const getResizerProps = (): SplitResizerProps => ({
	color: "var(--mantine-color-dark-9)",
	hoverColor: "var(--mantine-color-dark-9)",
});

export const WorkspaceInner: React.FC = observer(() => {
	const { project } = useProject();

	if (!project) {
		appStore.setView("welcome");
		return;
	}

	const getPaneStyles = (section: Section) => ({
		root: { display: appStore.openSections.has(section) ? "initial" : "none" },
	});

	return (
		<Stack gap="0" h="100%">
			{platform === "macos" && <Menubar />}
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
						<Split.Pane minHeight="250px" styles={getPaneStyles("dock")}>
							<Dock />
						</Split.Pane>
					</Split>
				</Split.Pane>
			</Split>
		</Stack>
	);
});

export const Workspace: React.FC = () => {
	return (
		<DockTabsProvider>
			<WorkspaceInner />
		</DockTabsProvider>
	);
};
