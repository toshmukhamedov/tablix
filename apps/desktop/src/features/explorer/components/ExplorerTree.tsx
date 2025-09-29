import { Tree, type TreeNodeData, useTree } from "@mantine/core";
import { useMemo } from "react";
import { useConnections } from "../context/ConnectionsContext";
import { TreeLabel } from "./TreeLabel";

export const ExplorerTree: React.FC = () => {
	const { state } = useConnections();
	const tree = useTree();

	const treeData = useMemo<TreeNodeData[]>(() => {
		return state.connections.map((conn) => ({
			label: conn.name,
			value: conn.id,
		}));
	}, [state]);

	return (
		<Tree
			styles={{
				root: {
					overflowX: "scroll",
					height: "100%",
					marginRight: "1px",
				},
			}}
			data={treeData}
			tree={tree}
			renderNode={(payload) => <TreeLabel {...payload} />}
			selectOnClick
			clearSelectionOnOutsideClick
		/>
	);
};
