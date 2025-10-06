import { Split } from "@gfazioli/mantine-split-pane";
import { Paper, Stack, Title } from "@mantine/core";
import { ConnectionsProvider } from "@/context/ConnectionsContext";
import { MainTabsProvider } from "@/context/MainTabsContext";
import { useProject } from "@/context/ProjectContext";
import { useView } from "@/context/ViewContext";
import { Explorer } from "../explorer";
import { Main } from "./components/Main";
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
			<MainTabsProvider>
				<Stack gap="0" h="100%">
					<Menubar />
					<Split size="1px" w="100%" spacing="0" style={{ minHeight: 0, flex: 1 }}>
						<Split.Pane minWidth="200px">
							<Explorer />
						</Split.Pane>
						<Split.Resizer
							color="var(--mantine-color-dark-9)"
							hoverColor="var(--mantine-color-dark-9)"
						/>
						<Split.Pane grow>
							<Split size="1px" h="100%" spacing="0" orientation="horizontal">
								<Split.Pane grow>
									<Main />
								</Split.Pane>
								<Split.Resizer
									color="var(--mantine-color-dark-9)"
									hoverColor="var(--mantine-color-dark-9)"
								/>
								<Split.Pane minHeight="150px">
									<Paper>
										<Title>Dock</Title>
									</Paper>
								</Split.Pane>
							</Split>
						</Split.Pane>
					</Split>
				</Stack>
			</MainTabsProvider>
		</ConnectionsProvider>
	);
}
