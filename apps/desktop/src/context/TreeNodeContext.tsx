import { createContext, useContext, useState } from "react";

type Node = {
	id: string;
	type: "connection";
};
type TreeNodeContext = {
	node: Node | null;
	setNode: React.Dispatch<Node | null>;
};
const TreeNodeContext = createContext<TreeNodeContext | null>(null);

type Props = {
	children: React.ReactNode;
};
export const TreeNodeProvider: React.FC<Props> = ({ children }) => {
	const [node, setNode] = useState<Node | null>(null);

	return <TreeNodeContext.Provider value={{ node, setNode }}>{children}</TreeNodeContext.Provider>;
};

export const useTreeNode = () => {
	const context = useContext(TreeNodeContext);
	if (!context) {
		throw new Error("You should use this hook inside TreeNodeProvider");
	}
	return context;
};
