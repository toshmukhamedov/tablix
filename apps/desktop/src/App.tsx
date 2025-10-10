import { useEffect } from "react";

import "./App.css";
import { appCommands } from "./commands/app";
import { ProjectProvider } from "./context/ProjectContext";
import { useView } from "./context/ViewContext";
import { Welcome } from "./features/welcome";
import { Workspace } from "./features/workspace";

export type View = "welcome" | "workspace" | "settings";

export const App: React.FC = () => {
	// TODO: Implement stage
	const dev = true;

	const { view } = useView();

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
				{view === "welcome" ? (
					<Welcome />
				) : view === "workspace" ? (
					<Workspace />
				) : (
					<div>Settings</div>
				)}
			</ProjectProvider>
		</div>
	);
};
