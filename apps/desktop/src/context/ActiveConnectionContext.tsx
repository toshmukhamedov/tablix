import { createContext, useContext, useState } from "react";

type ActiveConnectionContext = {
	activeConnectionId: string | null;
	setActiveConnectionId: React.Dispatch<string | null>;
};

const ActiveConnectionContext = createContext<ActiveConnectionContext | null>(null);

type Props = {
	children: React.ReactNode;
};
export const ActiveConnectionProvider: React.FC<Props> = ({ children }) => {
	const [activeConnectionId, setActiveConnectionId] = useState<string | null>("default");

	return (
		<ActiveConnectionContext.Provider value={{ activeConnectionId, setActiveConnectionId }}>
			{children}
		</ActiveConnectionContext.Provider>
	);
};

export const useActiveConnection = () => {
	const context = useContext(ActiveConnectionContext);
	if (!context) {
		throw new Error("You should use this hook inside ActiveConnectionProvider");
	}

	return context;
};
