import { Tree, useTree } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import { connectionStore } from "@/stores/connectionStore";
import classes from "../styles/ExplorerTree.module.css";
import { TreeNode } from "./TreeLabel";

export const ExplorerTree: React.FC = observer(() => {
	const tree = useTree();
	const { project } = useProject();

	useEffect(() => {
		connectionStore.reload({ projectId: project.id });
	}, []);

	return (
		<Tree
			allowRangeSelection={false}
			className="scrollable"
			classNames={classes}
			tree={tree}
			data={connectionStore.treeData}
			selectOnClick
			expandOnClick={false}
			renderNode={TreeNode}
		/>
	);
});
