import { type MantineRadius, Skeleton, Table } from "@mantine/core";
import { randomId } from "@mantine/hooks";

type Props = {
	rows?: number;
	rowHeight?: number;
	radius?: MantineRadius;
};

export const SkeletonTable: React.FC<Props> = ({ rows, rowHeight, radius }) => {
	return (
		<Table withRowBorders={false}>
			<Table.Tbody>
				{Array.from({ length: rows ?? 10 }).map(() => (
					<Table.Tr key={randomId()}>
						<Table.Td>
							<Skeleton height={rowHeight ?? 36} radius={radius ?? "sm"} />
						</Table.Td>
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
};
