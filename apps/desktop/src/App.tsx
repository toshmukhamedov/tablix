import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { PrimeReactProvider } from "primereact/api";
import type React from "react";
import { useEffect } from "react";
import { appService } from "./services/AppService";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@gfazioli/mantine-split-pane/styles.css";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primeicons/primeicons.css";

// Create a new instances
const router = createRouter({ routeTree });
const queryClient = new QueryClient();

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export const App: React.FC = () => {
	useEffect(() => {
		appService.showWindow();
	});

	return (
		<MantineProvider defaultColorScheme="dark">
			<PrimeReactProvider>
				<ModalsProvider>
					<QueryClientProvider client={queryClient}>
						<Notifications />
						<RouterProvider router={router} />
					</QueryClientProvider>
				</ModalsProvider>
			</PrimeReactProvider>
		</MantineProvider>
	);
};
