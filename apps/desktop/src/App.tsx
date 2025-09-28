import { platformName } from "@/lib/platform";
import { useEffect } from "react";

import "@/assets/index.css";
import { appService } from "./services/AppService";

export const App: React.FC = () => {
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

		appService.showWindow();

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
			{platformName === "macos" && <div className="drag-region" data-tauri-drag-region />}
		</div>
	);
};
