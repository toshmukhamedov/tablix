import { type RenderTreeNodePayload, Text } from "@mantine/core";
import { IconSitemap } from "@tabler/icons-react";
import { TreeChevron } from "./TreeChevron";

type Props = {
	payload: RenderTreeNodePayload;
};
export const SchemaNode: React.FC<Props> = ({ payload }) => {
	const toggleExpanded = (e: React.MouseEvent) => {
		e.stopPropagation();
		payload.tree.toggleExpanded(payload.node.value);
	};

	return (
		<div role="menu" onDoubleClick={toggleExpanded} {...payload.elementProps}>
			<button type="button" onClick={toggleExpanded} className="pl-2">
				<TreeChevron expanded={payload.expanded} />
			</button>
			<div>
				<span className="text-[var(--mantine-color-dark-2)]">
					<IconSitemap size="16" />
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
};
