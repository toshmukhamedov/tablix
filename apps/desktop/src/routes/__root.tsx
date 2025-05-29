import { Toaster } from "@/components/ui/toaster";
import { platformName } from "@/lib/platform";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

import "@/assets/index.css";

export const Route = createRootRoute({
	component: () => {
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

			return () => {
				window.removeEventListener("dragover", handleDragOver);
				window.removeEventListener("drop", handleDrop);
			};
		}, []);

		const handleContextMenu = (e: React.MouseEvent) => {
			if (!dev) e.preventDefault();
		};

		return (
			<div
				className="app-root"
				role="application"
				onContextMenu={handleContextMenu}
			>
				{platformName === "macos" && (
					<div className="drag-region" data-tauri-drag-region />
				)}

				<Outlet />
				<Toaster />
				<TanStackRouterDevtools />
			</div>
		);
	},
});
