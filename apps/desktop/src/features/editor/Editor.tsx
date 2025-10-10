import { PostgreSQL, sql } from "@codemirror/lang-sql";
import { Text } from "@mantine/core";
import { IconDatabase, IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import { keymap, useCodeMirror } from "@uiw/react-codemirror";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiLogoPostgresql } from "react-icons/bi";
import { queryCommands } from "@/commands/query";
import { ToolbarButton } from "@/components/ToolbarButton";
import { useConnections } from "@/context/ConnectionsContext";
import { type DataViewTab, useDockTabs } from "@/context/DockTabsContext";
import { type EditorTab, useMainTabs } from "@/context/MainTabsContext";
import { useOpenSections } from "@/context/OpenSectionsContext";
import { useProject } from "@/context/ProjectContext";
import { tablix } from "./theme";

const extensions = [sql({ dialect: PostgreSQL, upperCaseKeywords: true })];

type Props = {
	tab: EditorTab;
};
export const Editor: React.FC<Props> = ({ tab }) => {
	const editor = useRef<HTMLDivElement | null>(null);
	const [content, setContent] = useState<string>("");
	const [isExecuting, setIsExecuting] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const {
		state: { connections },
	} = useConnections();

	const connection = useMemo(
		() => connections.find((connection) => connection.id === tab.connectionId),
		[tab.connectionId],
	);

	const { project } = useProject();
	const { dispatch: mainTabsDispatch } = useMainTabs();
	const { dispatch: dockTabsDispatch } = useDockTabs();
	const { setOpenSections } = useOpenSections();

	const loadContent = async () => {
		const content = await queryCommands.getContent({
			projectId: project.id,
			name: tab.query.name,
		});
		setContent(content);
	};

	useEffect(() => {
		loadContent().catch(console.error);
	}, []);

	const saveKeymap = keymap.of([
		{
			key: "Ctrl-s",
			mac: "Cmd-s",
			run: (view) => {
				queryCommands
					.updateContent({
						projectId: project.id,
						name: tab.query.name,
						content: view.state.doc.toString(),
					})
					.then(() => {
						mainTabsDispatch({ type: "mark_as_dirty", tabId: tab.id, isDirty: false });
					});
				return true;
			},
		},
	]);

	const { setContainer, view } = useCodeMirror({
		container: editor.current,
		extensions: [...extensions, saveKeymap],
		value: content,
		theme: tablix,
		height: "100%",
		onChange: (value) => {
			mainTabsDispatch({
				type: "mark_as_dirty",
				tabId: tab.id,
				isDirty: value !== content,
			});
		},
		autoFocus: true,
	});

	useEffect(() => {
		if (editor.current) {
			setContainer(editor.current);
		}
	}, [editor.current]);

	const executeQuery = async () => {
		if (!view || !connection) return;
		try {
			setIsExecuting(true);

			const results = await queryCommands.execute({
				connectionId: connection.id,
				projectId: project.id,
				query: view.state.doc.toString(),
			});

			const tableData = results
				.filter((result) => result.type === "data")
				.map<Omit<DataViewTab, "id">>((result) => ({
					rows: result.rows,
					columns: result.columns,
				}));

			dockTabsDispatch({
				type: "set_tabs",
				connectionId: connection.id,
				tabs: tableData,
			});

			// Open Dock
			setOpenSections((prev) => {
				const sections = new Set(prev);
				sections.add("dock");
				return sections;
			});
		} catch (e) {
			console.error("[executeQuery]", e);
		} finally {
			setIsExecuting(false);
		}
	};

	const cancelQuery = async () => {
		if (!connection) return;
		try {
			setIsCancelling(true);

			await queryCommands.cancel({
				connectionId: connection.id,
				projectId: project.id,
			});
			setIsExecuting(false);
		} catch (e) {
			console.error("[executeQuery]", e);
		} finally {
			setIsCancelling(false);
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div className="h-10 px-2 py-1 border-y border-y-[var(--mantine-color-dark-6)] flex items-center">
				<ToolbarButton disabled={isExecuting || !connection} onClick={executeQuery} title="Execute">
					<IconPlayerPlay rotate="180" size="20" color="var(--mantine-color-green-4)" />
				</ToolbarButton>
				<div className="border-l h-4 border-l-[var(--mantine-color-dark-5)] mx-2" />
				<ToolbarButton disabled={!isExecuting || isCancelling} onClick={cancelQuery} title="Cancel">
					<IconPlayerStop size="20" color="var(--mantine-color-red-5)" />
				</ToolbarButton>
				<ToolbarButton
					className="justify-self-end relative ml-auto text-[var(--mantine-color-dark-1)]"
					title="Connection"
				>
					<div className="flex items-center gap-1">
						{connection ? (
							<>
								<span className="text-[var(--postgresql)]">
									<BiLogoPostgresql size="16" />
								</span>
								<Text size="sm">{connection.name}</Text>
							</>
						) : (
							<>
								<span>
									<IconDatabase size="16" />
								</span>
								<Text size="sm">{"<connection>"}</Text>
							</>
						)}
					</div>
					<select
						defaultValue="connections"
						onChange={(e) =>
							mainTabsDispatch({
								type: "set_connection",
								tabId: tab.id,
								connectionId: e.target.value,
							})
						}
						className="absolute w-full h-full top-0 left-0 opacity-0"
						style={{ fontSize: "12px" }}
					>
						<option value="connections" disabled>
							Connections
						</option>
						{connections.map((connection) => (
							<option value={connection.id} key={connection.id}>
								{connection.name}
							</option>
						))}
					</select>
				</ToolbarButton>
			</div>
			<div className="flex-1 min-h-0" ref={editor} />
		</div>
	);
};
