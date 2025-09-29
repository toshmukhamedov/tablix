import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@gfazioli/mantine-split-pane/styles.css";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ViewProvider } from "./context/ViewContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<MantineProvider defaultColorScheme="dark">
			<ModalsProvider>
				<Notifications />
				<ViewProvider>
					<App />
				</ViewProvider>
			</ModalsProvider>
		</MantineProvider>
	</React.StrictMode>,
);
