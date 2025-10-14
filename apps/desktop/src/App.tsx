import { useEffect } from "react";

import "./App.css";
import { observer } from "mobx-react-lite";
import { appCommands } from "./commands/app";
import { ProjectProvider } from "./context/ProjectContext";
import { Welcome } from "./features/welcome";
import { Workspace } from "./features/workspace";
import { appStore } from "./stores/appStore";

export type View = "welcome" | "workspace" | "settings";

export const App: React.FC = observer(() => {
	// TODO: Implement stage
	const dev = true;

	useEffect(() => {
		const handleDragOver = (e: DragEvent) => {
			e.preventDefault();
		};

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
		};

		window.addEventListener("dragover", handleDragOver);
		window.addEventListener("drop", handleDrop);

		appCommands.showWindow();

		return () => {
			window.removeEventListener("dragover", handleDragOver);
			window.removeEventListener("drop", handleDrop);
		};
	}, []);

	const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (e) => {
		if (!dev) e.preventDefault();
	};

	return (
		<div id="app" role="application" onContextMenu={handleContextMenu}>
			<ProjectProvider>
				{appStore.view === "welcome" ? (
					<Welcome />
				) : appStore.view === "workspace" ? (
					<Workspace />
				) : (
					<div>Settings</div>
				)}
			</ProjectProvider>
		</div>
	);
});
