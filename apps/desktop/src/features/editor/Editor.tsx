import { PostgreSQL, sql } from "@codemirror/lang-sql";
import { EditorView, keymap, useCodeMirror } from "@uiw/react-codemirror";
import { useEffect, useRef, useState } from "react";
import { queryCommands } from "@/commands/query";
import { type EditorTab, useMainTabs } from "@/context/MainTabsContext";
import { useProject } from "@/context/ProjectContext";

const extensions = [
	sql({ dialect: PostgreSQL, upperCaseKeywords: true }),
	EditorView.theme(
		{
			"&": {
				fontSize: "14px",
			},
			".cm-content": {
				fontFamily: "JetBrains Mono",
			},
			".cm-tooltip.cm-tooltip-autocomplete ul": {
				fontFamily: "JetBrains Mono",
			},
			".cm-gutterElement": {
				fontFamily: "JetBrains Mono",
				color: "var(--mantine-color-dark-4)",
			},
			".cm-gutterElement.cm-activeLineGutter": {
				color: "var(--mantine-color-dark-2)",
			},
			".cm-fat-cursor": {
				background: "var(--mantine-color-blue-6) !important",
			},
			"&:not(.cm-focused) .cm-fat-cursor": {
				display: "none",
			},
			"&.cm-focused": {
				outline: "none",
			},
		},
		{ dark: true },
	),
];

type Props = {
	tab: EditorTab;
};
export const Editor: React.FC<Props> = ({ tab }) => {
	const editor = useRef<HTMLDivElement | null>(null);
	const [content, setContent] = useState<string>("");

	const { project } = useProject();
	const { dispatch } = useMainTabs();

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
						dispatch({ type: "mark_as_dirty", tabId: tab.id, isDirty: false });
					});
				return true;
			},
		},
	]);

	const { setContainer } = useCodeMirror({
		container: editor.current,
		extensions: [...extensions, saveKeymap],
		value: content,
		theme: "dark",
		height: "100%",
		onChange: (value) => {
			dispatch({
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

	return <div className="h-full" ref={editor} />;
};
