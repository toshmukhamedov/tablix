import { Group, type RenderTreeNodePayload, Text } from "@mantine/core";
import { TreeChevron } from "./TreeChevron";

import "../styles/tree-label.css";
import { poolService } from "@/services/pool";
import { useMutation } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { useEffect } from "react";

export const TreeLabel: React.FC<RenderTreeNodePayload> = ({ node, elementProps, expanded }) => {
	const project = useLoaderData({ from: "/workspace/$projectId" });

	const labelProps: RenderTreeNodePayload["elementProps"] = {
		...elementProps,
		"data-hovered": undefined,
		"data-selected": undefined,
	};
	const innerLabelProps: RenderTreeNodePayload["elementProps"] = {
		...elementProps,
		className: "inner-label",
	};

	const createPoolMutation = useMutation({
		mutationFn: poolService.createPool,
	});

	useEffect(() => {
		if (!expanded) return;
		createPoolMutation.mutate({
			projectId: project.id,
			connId: node.value,
		});
	}, [expanded]);

	return (
		<Group {...labelProps}>
			<div className="outer-label">
				<div {...innerLabelProps}>
					<TreeChevron expanded={expanded} loading={createPoolMutation.isPending} />
					<Text size="sm" fw="500" style={{ whiteSpace: "nowrap" }}>
						{node.label}
					</Text>
				</div>
			</div>
		</Group>
	);
};
