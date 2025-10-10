import { PostgreSQL, sql } from "@codemirror/lang-sql";
import { highlightTree } from "@lezer/highlight";
import { tablixHighlightStyle } from "@/features/editor/theme";

export function highlightSQL(code: string): string {
	const tree = sql({ dialect: PostgreSQL }).language.parser.parse(code);
	let result = "";
	let pos = 0;

	highlightTree(tree, tablixHighlightStyle, (from, to, classes) => {
		result += `${code.slice(pos, from)}<span class="${classes}">${code.slice(from, to)}</span>`;
		pos = to;
	});

	result += code.slice(pos);
	return result;
}

export function QueryPreview({ code }: { code: string }) {
	return (
		<pre
			// biome-ignore lint/security/noDangerouslySetInnerHtml: required
			dangerouslySetInnerHTML={{ __html: highlightSQL(code) }}
		/>
	);
}
