import { Text } from "@mantine/core";
import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconRefresh,
} from "@tabler/icons-react";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import {
	connectionCommands,
	type Pagination,
	type Row,
	type TableData,
} from "@/commands/connection";
import { ToolbarButton } from "@/components/ToolbarButton";
import type { TableViewTab } from "@/context/MainTabsContext";
import { useProject } from "@/context/ProjectContext";
import classes from "../styles/TableView.module.css";

type Props = {
	tab: TableViewTab;
};
export const TableView: React.FC<Props> = ({ tab }) => {
	const { project } = useProject();
	const [tableData, setTableData] = useState<TableData>({
		columns: [],
		rows: [],
		rowsCount: 0,
		hasMore: true,
		rangeStart: 1,
		rangeEnd: 100,
	});
	const [pagination, setPagination] = useState<Pagination>({
		pageIndex: 0,
		pageSize: 100,
	});

	const loadData = async () => {
		const tableData = await connectionCommands.getTableData({
			projectId: project.id,
			connectionId: tab.connectionId,
			pagination,
			schema: tab.schema,
			table: tab.table,
		});
		setTableData(tableData);
	};

	useEffect(() => {
		loadData().catch(console.error);
	}, [pagination]);

	const columns = useMemo(() => {
		const columns: ColumnDef<Row>[] = [
			{
				id: "index",
				header: "",
				accessorFn: (_, index) => index + tableData.rangeStart,
			},
		];
		for (let index = 0; index < tableData.columns.length; index++) {
			const column = tableData.columns[index];
			columns.push({
				id: index.toString(),
				header: () => (
					<>
						<span className="pr-2">{column.name}</span>
						<span className="text-[var(--mantine-color-dark-4)] text-xs font-sans font-normal">
							{column.dataType}
						</span>
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
			pagination,
		},
		getCoreRowModel: getCoreRowModel(),
		rowCount: tableData.rowsCount,
		manualPagination: true,
		onPaginationChange: setPagination,
		autoResetPageIndex: false,
	});

	const canPreviousPage = table.getCanPreviousPage();
	const canNextPage = table.getCanNextPage();

	const refreshRowsCount = () => {
		connectionCommands
			.getTableDataCount({
				projectId: project.id,
				connectionId: tab.connectionId,
				schema: tab.schema,
				table: tab.table,
			})
			.then((rowsCount) => {
				setTableData((prev) => ({ ...prev, rowsCount }));
			});
	};

	return (
		<div className="h-full flex flex-col">
			<div className="h-10 px-2 py-1 flex items-center shrink-0">
				<ToolbarButton disabled={!canPreviousPage} onClick={table.firstPage} title="First Page">
					<IconChevronsLeft stroke="1" size="20" />
				</ToolbarButton>
				<ToolbarButton
					disabled={!canPreviousPage}
					onClick={table.previousPage}
					title="Previous Page"
				>
					<IconChevronLeft stroke="1" size="20" />
				</ToolbarButton>
				<ToolbarButton className="mr-1 relative" title="Change Page Size">
					<Text size="xs">
						{tableData.rangeStart}-{tableData.rangeEnd}
					</Text>
					<select
						value={pagination.pageSize}
						onChange={(e) => setPagination({ pageIndex: 0, pageSize: Number(e.target.value) })}
						className="absolute w-full h-full top-0 left-0 opacity-0"
						style={{ fontSize: "12px" }}
					>
						<optgroup label="Page Size">
							<option value="10">10</option>
							<option value="50">50</option>
							<option value="100">100</option>
							<option value="500">500</option>
						</optgroup>
					</select>
				</ToolbarButton>

				<ToolbarButton onClick={refreshRowsCount} title="Refresh total count">
					<Text size="xs">of {tableData.rowsCount}</Text>
				</ToolbarButton>
				<ToolbarButton disabled={!canNextPage} onClick={table.nextPage} title="Next Page">
					<IconChevronRight stroke="1" size="20" />
				</ToolbarButton>
				<ToolbarButton disabled={!canNextPage} onClick={table.lastPage} title="Last Page">
					<IconChevronsRight stroke="1" size="20" />
				</ToolbarButton>
				<div className="border-l h-4 border-l-[var(--mantine-color-dark-5)] mx-2" />
				<ToolbarButton onClick={() => setPagination((prev) => ({ ...prev }))} title="Refresh data">
					<IconRefresh stroke="1" size="20" />
				</ToolbarButton>
			</div>
			<div className={classes.tableWrapper}>
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
		</div>
	);
};
