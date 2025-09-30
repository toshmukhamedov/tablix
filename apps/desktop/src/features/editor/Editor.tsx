import { PostgreSQL, sql } from "@codemirror/lang-sql";
import { vim } from "@replit/codemirror-vim";
import { EditorView, basicSetup, useCodeMirror } from "@uiw/react-codemirror";
import { useEffect, useRef } from "react";

const code = "SELECT * FROM products\n\n\n";
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
			".cm-fat-cursor": {
				background: "var(--mantine-color-blue-6) !important",
			},
		},
		{ dark: true },
	),
];

export const Editor: React.FC = () => {
	const editor = useRef(null);

	const { setContainer } = useCodeMirror({
		container: editor.current,
		extensions,
		value: code,
		theme: "dark",
		height: "100%",
	});

	useEffect(() => {
		if (editor.current) {
			setContainer(editor.current);
		}
	}, [editor.current]);

	return <div style={{ height: "100%" }} ref={editor} />;
};
