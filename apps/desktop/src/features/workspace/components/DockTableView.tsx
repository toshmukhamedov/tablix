import { Text } from "@mantine/core";
import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconRefresh,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import type { Pagination, Row } from "@/commands/connection";
import { ToolbarButton } from "@/components/ToolbarButton";
import type { DataViewTab } from "@/context/DockTabsContext";
import classes from "../styles/TableView.module.css";

type Props = {
	tab: DataViewTab;
};
export const DockTableView: React.FC<Props> = ({ tab }) => {
	const [pagination, setPagination] = useState<Pagination>({
		pageIndex: 0,
		pageSize: 100,
	});
	const rangeStart = pagination.pageIndex * pagination.pageSize + 1;
	const rangeEnd = (pagination.pageIndex + 1) * pagination.pageSize;

	const columns = useMemo(() => {
		const columns: ColumnDef<Row>[] = [
			{
				id: "index",
				header: "",
				accessorFn: (_, index) => index + rangeStart,
			},
		];
		for (let index = 0; index < tab.columns.length; index++) {
			const column = tab.columns[index];
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
	}, [tab.columns]);

	const table = useReactTable({
		data: tab.rows,
		columns,
		state: {
			columnPinning: {
				left: ["index"],
			},
			pagination,
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		rowCount: tab.rows.length,
		onPaginationChange: setPagination,
		autoResetPageIndex: false,
	});

	const canPreviousPage = table.getCanPreviousPage();
	const canNextPage = table.getCanNextPage();

	const refreshRowsCount = () => {
		// TODO: Implement refreshRowsCount
	};

	return (
		<div className="h-full flex flex-col">
			<div className="h-10 px-2 py-1 flex items-center">
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
						{rangeStart}-{rangeEnd}
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
					<Text size="xs">of {tab.rows.length}</Text>
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
