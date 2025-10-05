import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { connectionCommands, type Row, type TableData } from "@/commands/connection";
import type { TableViewTab } from "@/context/MainTabsContext";
import { useProject } from "@/context/ProjectContext";

import classes from "../styles/TableView.module.css";

type Props = {
	tab: TableViewTab;
};
export const TableView: React.FC<Props> = ({ tab }) => {
	const { project } = useProject();
	const [tableData, setTableData] = useState<TableData>({ columns: [], rows: [] });

	useEffect(() => {
		connectionCommands
			.getTableData({
				projectId: project.id,
				connectionId: tab.connectionId,
				pagination: {
					page: 1,
					perPage: 100,
				},
				schema: tab.schema,
				table: tab.table,
			})
			.then(setTableData);
	}, [tab.connectionId]);

	const columns = useMemo(() => {
		const columns: ColumnDef<Row>[] = [
			{
				id: "index",
				header: "",
				accessorFn: (_, index) => index + 1,
			},
		];
		for (let index = 0; index < tableData.columns.length; index++) {
			const column = tableData.columns[index];
			columns.push({
				id: index.toString(),
				header: () => (
					<>
						<span className="pr-2">{column.name}</span>
						<span className="text-[var(--mantine-color-gray-4)]">{column.dataType}</span>
					</>
				),
				accessorFn: (row) => {
					const data = row[index];
					if (typeof data === "object") {
						return JSON.stringify(data);
					}
					return data;
				},
			});
		}
		return columns;
	}, [tableData]);

	const table = useReactTable({
		data: tableData.rows,
		columns,
		state: {
			columnPinning: {
				left: ["index"],
			},
		},
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="bg-[var(--mantine-color-dark-9)] h-full overflow-auto">
			<table className={classes.table}>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
