import { createContext, useContext, useEffect, useReducer } from "react";
import { type Connection, type ConnectionSchema, connectionCommands } from "@/commands/connection";
import { useProject } from "./ProjectContext";

type ConnectionsContextState = {
	connections: Connection[];
	schemas: Map<string, ConnectionSchema>;
};

type ConnectionsContext = {
	state: ConnectionsContextState;
	dispatch: React.Dispatch<ConnectionsAction>;
};

const ConnectionsContext = createContext<ConnectionsContext | null>(null);

export type ConnectionsAction =
	| {
			type: "set";
			connections: Connection[];
	  }
	| {
			type: "schemas";
			schemas: Map<string, ConnectionSchema>;
	  };

const reducer: React.Reducer<ConnectionsContextState, ConnectionsAction> = (state, action) => {
	switch (action.type) {
		case "set":
			state.connections = action.connections;
			return { ...state };
		case "schemas":
			state.schemas = new Map(action.schemas);
			return { ...state };
	}
};

type Props = {
	children: React.ReactNode;
};
export const ConnectionsProvider: React.FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, { connections: [], schemas: new Map() });
	const { project } = useProject();
	useEffect(() => {
		connectionCommands
			.list({ projectId: project.id })
			.then((connections) => dispatch({ type: "set", connections }));
	}, []);
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
