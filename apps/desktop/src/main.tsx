import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<MantineProvider defaultColorScheme="auto">
			<ModalsProvider>
				<Notifications />
				<RouterProvider router={router} />
			</ModalsProvider>
		</MantineProvider>
	</React.StrictMode>,
);
