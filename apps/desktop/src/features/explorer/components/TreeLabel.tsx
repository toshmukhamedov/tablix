import { Flex, Text } from "@mantine/core";
import { TreeChevron } from "./TreeChevron";

import { poolService } from "@/services/pool";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import type { TreeNode } from "primereact/treenode";

type TreeLabelProps = {
	node: TreeNode;
};

export const TreeLabel: React.FC<TreeLabelProps> = ({ node }) => {
	const project = useLoaderData({ from: "/workspace/$projectId" });
	const createPoolMutation = useMutation({
		mutationFn: poolService.createPool,
		onSuccess: () => {
			console.info("Success");
		},
		onError: () => {
			notifications.show({
				color: "red",
				message: "Creating pool",
			});
		},
	});
	const onDoubleClick = () => {
		if (createPoolMutation.isPending) return;
		console.info("Double", node.data);
		createPoolMutation.mutate({
			projectId: project.id,
			connId: node.data.id,
		});
	};

	return (
		<Flex align="center" gap="6px" onDoubleClick={onDoubleClick}>
			<TreeChevron loading={createPoolMutation.isPending} node={node} />
			<Text size="sm" fw="500" style={{ whiteSpace: "nowrap", marginRight: "10px" }}>
				{node.label}
			</Text>
		</Flex>
	);
};
