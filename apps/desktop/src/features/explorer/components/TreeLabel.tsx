import { Group, type RenderTreeNodePayload, Text } from "@mantine/core";
import { TreeChevron } from "./TreeChevron";

import "../styles/tree-label.css";

export const TreeLabel: React.FC<RenderTreeNodePayload> = ({ node, elementProps, expanded }) => {
	const labelProps: RenderTreeNodePayload["elementProps"] = {
		...elementProps,
		"data-hovered": undefined,
		"data-selected": undefined,
	};
	const innerLabelProps: RenderTreeNodePayload["elementProps"] = {
		...elementProps,
		className: "inner-label",
	};
	return (
		<Group {...labelProps}>
			<div className="outer-label">
				<div {...innerLabelProps}>
					<TreeChevron expanded={expanded} />
					<Text size="sm" fw="500" style={{ whiteSpace: "nowrap" }}>
						{node.label}
					</Text>
				</div>
			</div>
		</Group>
	);
};
