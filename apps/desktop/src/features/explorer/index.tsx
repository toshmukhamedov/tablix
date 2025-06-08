import { connectionsService } from "@/services/connections";
import {
	Button,
	Flex,
	Group,
	type RenderTreeNodePayload,
	Stack,
	Text,
	Title,
	Tooltip,
	Tree,
	type TreeNodeData,
	useTree,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight, IconPlug } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { useMemo } from "react";
import { AddConnectionModal } from "./components/AddConnectionModal";
import classes from "./tree.module.css";

function Leaf({ node, elementProps }: RenderTreeNodePayload) {
	return (
		<Group gap={5} {...elementProps}>
			<IconChevronRight size="16px" color="var(--mantine-color-dark-2)" />
			<Text>{node.label}</Text>
		</Group>
	);
}

export const Explorer: React.FC = () => {
	const [addConnectionModalOpened, addConnectionModalHandlers] = useDisclosure();
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
		<Stack
			styles={{
				root: {
					height: "100%",
					width: "100%",
					border: "1px solid var(--mantine-color-dark-9)",
					borderTop: "none",
					borderLeft: "none",
				},
			}}
		>
			<Flex
				h="xl"
				align="center"
				styles={{ root: { borderBottom: "1px solid var(--mantine-color-dark-9)" } }}
				justify="space-between"
				px="sm"
			>
				<Title size="sm">Explorer</Title>
				<Flex>
					<Tooltip label="Add connection" position="bottom" color="dark" fz="xs" c="dark.0">
						<Button
							color="gray"
							p="4px"
							size="compact-xs"
							variant="subtle"
							onClick={addConnectionModalHandlers.open}
						>
							<IconPlug size="16" />
						</Button>
					</Tooltip>
				</Flex>
			</Flex>
			<Tree
				classNames={classes}
				data={treeData}
				tree={tree}
				renderNode={(payload) => <Leaf {...payload} />}
				selectOnClick
				clearSelectionOnOutsideClick
			/>
			<AddConnectionModal
				opened={addConnectionModalOpened}
				onClose={addConnectionModalHandlers.close}
			/>
		</Stack>
	);
};
