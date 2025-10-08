import { createContext, useContext, useEffect, useState } from "react";
import { type Query, queryCommands } from "@/commands/query";
import { useProject } from "./ProjectContext";

type QueriesContext = {
	queries: Query[];
	setQueries: React.Dispatch<Query[]>;
};

const QueriesContext = createContext<QueriesContext | null>(null);

type Props = {
	children: React.ReactNode;
};
export const QueriesProvider: React.FC<Props> = ({ children }) => {
	const [queries, setQueries] = useState<Query[]>([]);
	const { project } = useProject();
	useEffect(() => {
		queryCommands.list({ projectId: project.id }).then(setQueries);
	}, []);
	return (
		<QueriesContext.Provider value={{ queries, setQueries }}>{children}</QueriesContext.Provider>
	);
};

export const useQueries = () => {
	const context = useContext(QueriesContext);
	if (!context) {
		throw new Error("You should use this hook inside QueriesProvider");
	}

	return context;
};
