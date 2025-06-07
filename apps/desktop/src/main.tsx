import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@gfazioli/mantine-split-pane/styles.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { appService } from "./services/AppService";

// Create a new instances
const router = createRouter({ routeTree });
const queryClient = new QueryClient();

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const App: React.FC = () => {
	useEffect(() => {
		appService.showWindow();
	});

	return (
		<MantineProvider defaultColorScheme="dark">
			<ModalsProvider>
				<QueryClientProvider client={queryClient}>
					<Notifications />
					<RouterProvider router={router} />
				</QueryClientProvider>
			</ModalsProvider>
		</MantineProvider>
	);
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
