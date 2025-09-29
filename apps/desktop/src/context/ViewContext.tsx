import type { View } from "@/App";
import { createContext, useContext, useState } from "react";

type ViewContext = { view: View; setView: React.Dispatch<View> };

const ViewContext = createContext<ViewContext | null>(null);

type Props = {
	children: React.ReactNode;
};
export const ViewProvider: React.FC<Props> = ({ children }) => {
	const [view, setView] = useState<View>("welcome");

	return <ViewContext.Provider value={{ view, setView }}>{children}</ViewContext.Provider>;
};

export const useView = () => {
	const context = useContext(ViewContext);
	if (!context) {
		throw new Error("You should use this hook inside ViewProvider");
	}

	return context;
};
