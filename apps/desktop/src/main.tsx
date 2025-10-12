import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@gfazioli/mantine-split-pane/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ViewProvider } from "./context/ViewContext";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<MantineProvider defaultColorScheme="dark" theme={theme}>
			<Notifications />
			<ViewProvider>
				<App />
			</ViewProvider>
		</MantineProvider>
	</React.StrictMode>,
);
