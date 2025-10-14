import { type RenderTreeNodePayload, Text } from "@mantine/core";
import { IconTable } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import { tabStore } from "@/stores/tabStore";
import { TreeChevron } from "./TreeChevron";

type Props = {
	payload: RenderTreeNodePayload;
};
export const TableNode: React.FC<Props> = observer(({ payload }) => {
	const toggleExpanded = (e: React.MouseEvent) => {
		e.stopPropagation();
		payload.tree.toggleExpanded(payload.node.value);
	};

	const onDoubleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		const [connectionId, schema, table] = payload.node.value.split(".");
		tabStore.addView({
			type: "view",
			connectionId,
			schema,
			table,
		});
	};

	return (
		<div role="menu" onDoubleClick={onDoubleClick} {...payload.elementProps}>
			<button type="button" onClick={toggleExpanded} className="pl-2">
				<TreeChevron expanded={payload.expanded} />
			</button>
			<div>
				<span className="text-[var(--mantine-color-dark-2)]">
					<IconTable size="16" />
				</span>
				<span
					className="h-1 w-1 self-end rounded-full data-[connected=true]:bg-[var(--mantine-color-green-2)]"
					data-connected={payload.node.nodeProps?.connected}
				/>
			</div>
			<Text size="sm" fw="500">
				{payload.node.label}
			</Text>
		</div>
	);
});
