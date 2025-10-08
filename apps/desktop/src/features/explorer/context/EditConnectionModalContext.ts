import { createContext, useContext } from "react";

type EditConnectionModalContext = {
	opened: boolean;
	setOpened: React.Dispatch<boolean>;
};
export const EditConnectionModalContext = createContext<EditConnectionModalContext | null>(null);

export const useEditConnectionModal = () => {
	const context = useContext(EditConnectionModalContext);
	if (!context) {
		throw new Error("You should use this hook inside EditConnectionModalContext.Provider");
	}
	return context;
};
