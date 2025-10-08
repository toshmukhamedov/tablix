import { PostgreSQL, sql } from "@codemirror/lang-sql";
import { vim } from "@replit/codemirror-vim";
import { EditorView, useCodeMirror } from "@uiw/react-codemirror";
import { useEffect, useRef } from "react";
import { queryCommands } from "@/commands/query";
import type { EditorTab } from "@/context/MainTabsContext";
import { useProject } from "@/context/ProjectContext";

const extensions = [
	vim(),
	sql({ dialect: PostgreSQL }),
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
	const { project } = useProject();

	const { setContainer, view } = useCodeMirror({
		container: editor.current,
		extensions,
		theme: "dark",
		height: "100%",
	});

	const loadContent = async () => {
		if (!view) return;
		const content = await queryCommands.getContent({
			projectId: project.id,
			name: tab.query.name,
		});
		view.dispatch({
			changes: { from: 0, to: view.state.doc.length, insert: content },
		});
	};

	useEffect(() => {
		loadContent().catch(console.error);
	}, [view]);

	useEffect(() => {
		if (editor.current) {
			setContainer(editor.current);
		}
	}, [editor.current]);

	return <div className="h-full" ref={editor} />;
};
