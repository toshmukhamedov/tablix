import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { createContext, useContext, useEffect, useState } from "react";
import type { QueryOutput } from "@/commands/query";
import { useActiveConnection } from "./ActiveConnectionContext";

type ConnectionOutputContext = {
	outputs: Map<string, QueryOutput[]>;
	setOutputs: React.Dispatch<Map<string, QueryOutput[]>>;
};

const ConnectionOutputContext = createContext<ConnectionOutputContext | null>(null);

type Props = {
	children: React.ReactNode;
};
export const ConnectionOutputProvider: React.FC<Props> = ({ children }) => {
	const [outputs, setOutputs] = useState<Map<string, QueryOutput[]>>(new Map([["default", []]]));
	const { setActiveConnectionId } = useActiveConnection();

	useEffect(() => {
		let unlisten: UnlistenFn | null = null;

		const setupListener = async () => {
			unlisten = await listen<QueryOutput>("query_output", (event) => {
				const { payload } = event;
				setOutputs((prev) => {
					const newOutput = new Map(prev);

					const outputs = newOutput.get(payload.connectionId);
					if (outputs) {
						newOutput.set(payload.connectionId, [payload, ...outputs]);
					} else {
						newOutput.set(payload.connectionId, [payload]);
					}

					return newOutput;
				});
				setActiveConnectionId(payload.connectionId);
			});
		};
		setupListener();

		return () => {
			if (unlisten) {
				unlisten();
			}
		};
	}, []);

	return (
		<ConnectionOutputContext.Provider value={{ outputs, setOutputs }}>
			{children}
		</ConnectionOutputContext.Provider>
	);
};

export const useConnectionOutputs = () => {
	const context = useContext(ConnectionOutputContext);
	if (!context) {
		throw new Error("You should use this hook inside ConnectionOutputProvider");
	}

	return context;
};
