import { Group, type RenderTreeNodePayload, Text } from "@mantine/core";
import { TreeChevron } from "./TreeChevron";

import "../styles/tree-label.css";

export const TreeLabel: React.FC<RenderTreeNodePayload> = ({ node, elementProps, expanded }) => {
	return (
		// Label
		<Group {...elementProps}>
			<div className="inner-label">
				<TreeChevron expanded={expanded} />
				<Text size="sm" style={{ whiteSpace: "nowrap" }}>
					{node.label}
				</Text>
			</div>
		</Group>
	);
};
