import { connectionsService } from "@/services/connections";
import { Tree, type TreeNodeData, useTree } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { useMemo } from "react";
import { TreeLabel } from "./TreeLabel";

export const ExplorerTree: React.FC = () => {
	const project = useLoaderData({ from: "/workspace/$projectId" });
	const query = useQuery({
		queryKey: ["connections"],
		queryFn: () => connectionsService.list({ projectId: project.id }),
	});
	const tree = useTree();

	const treeData = useMemo<TreeNodeData[]>(() => {
		if (!query.data) return [];
		return query.data.map((conn) => ({
			label: conn.name,
			value: conn.id,
		}));
	}, [query.data]);

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
