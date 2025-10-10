import { createContext, useContext, useState } from "react";

export type Section = "dock" | "explorer" | "queries";
type OpenSectionsContext = {
	openSections: Set<Section>;
	setOpenSections: React.Dispatch<React.SetStateAction<Set<Section>>>;
};

const OpenSectionsContext = createContext<OpenSectionsContext | null>(null);

type Props = {
	children: React.ReactNode;
};
export const OpenSectionsProvider: React.FC<Props> = ({ children }) => {
	const [openSections, setOpenSections] = useState<Set<Section>>(new Set(["explorer", "queries"]));

	return (
		<OpenSectionsContext.Provider value={{ openSections, setOpenSections }}>
			{children}
		</OpenSectionsContext.Provider>
	);
};

export const useOpenSections = () => {
	const context = useContext(OpenSectionsContext);
	if (!context) {
		throw new Error("You should use this hook inside OpenSectionsProvider");
	}

	return context;
};
