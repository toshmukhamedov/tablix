import type { Connection } from "@/commands/connection";
import { createContext, useContext, useReducer } from "react";

type ConnectionsContextState = {
	connections: Connection[];
};

type ConnectionsContext = {
	state: ConnectionsContextState;
	dispatch: React.Dispatch<ConnectionsAction>;
};

const ConnectionsContext = createContext<ConnectionsContext | null>(null);

export type ConnectionsAction = {
	type: "set";
	connections: Connection[];
};

const reducer: React.Reducer<ConnectionsContextState, ConnectionsAction> = (_, action) => {
	switch (action.type) {
		case "set":
			return { connections: action.connections };
	}
};

type Props = {
	children: React.ReactNode;
};
export const ConnectionsProvider: React.FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, { connections: [] });

	return (
		<ConnectionsContext.Provider value={{ state, dispatch }}>
			{children}
		</ConnectionsContext.Provider>
	);
};

export const useConnections = () => {
	const context = useContext(ConnectionsContext);
	if (!context) {
		throw new Error("You should use this hook inside ConnectionsProvider");
	}

	return context;
};
