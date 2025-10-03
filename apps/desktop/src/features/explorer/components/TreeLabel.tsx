import type { RenderTreeNodePayload } from "@mantine/core";
import { ColumnNode } from "./ColumnNode";
import { ConnectionNode } from "./ConnectionNode";
import { SchemaNode } from "./SchemaNode";
import { TableNode } from "./TableNode";

export const TreeNode = (payload: RenderTreeNodePayload): React.ReactNode => {
	switch (payload.level) {
		case 1: {
			return <ConnectionNode payload={payload} />;
		}
		case 2: {
			return <SchemaNode payload={payload} />;
		}
		case 3: {
			return <TableNode payload={payload} />;
		}
		case 4: {
			return <ColumnNode payload={payload} />;
		}
	}
};
