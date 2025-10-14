import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

// Tablix Theme — inspired by One Dark
const chalky = "#e5c07b",
	coral = "#e06c75",
	cyan = "#56b6c2",
	invalid = "#ffffff",
	ivory = "#abb2bf",
	stone = "#7d8799",
	malibu = "#61afef",
	sage = "#98c379",
	whiskey = "#d19a66",
	violet = "#c678dd",
	darkBackground = "black",
	highlightBackground = "#2c313a",
	background = "var(--mantine-color-dark-9)",
	tooltipBackground = "#353a42",
	selection = "var(--mantine-color-blue-9)",
	cursor = "var(--mantine-color-blue-5)";

export const color = {
	chalky,
	coral,
	cyan,
	invalid,
	ivory,
	stone,
	malibu,
	sage,
	whiskey,
	violet,
	darkBackground,
	highlightBackground,
	background,
	tooltipBackground,
	selection,
	cursor,
};

export const tablixTheme = EditorView.theme(
	{
		"&": {
			color: ivory,
			backgroundColor: background,
			fontSize: "14px",
		},

		".cm-content": {
			caretColor: cursor,
			fontFamily: "JetBrains Mono",
		},

		".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
		"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
			{ backgroundColor: selection },

		".cm-panels": { backgroundColor: darkBackground, color: ivory },
		".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
		".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

		".cm-searchMatch": {
			backgroundColor: "#72a1ff59",
			outline: "1px solid #457dff",
		},
		".cm-searchMatch.cm-searchMatch-selected": {
			backgroundColor: "#6199ff2f",
		},

		".cm-activeLine": { backgroundColor: "#6699ff0b" },
		".cm-selectionMatch": { backgroundColor: "#aafe661a" },

		"&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
			backgroundColor: "#bad0f847",
		},

		".cm-gutters": {
			backgroundColor: background,
			color: stone,
			border: "none",
			borderRight: "1px solid var(--mantine-color-dark-8) !important",
		},

		".cm-activeLineGutter": {
			backgroundColor: highlightBackground,
		},

		".cm-foldPlaceholder": {
			backgroundColor: "transparent",
			border: "none",
			color: "#ddd",
		},

		".cm-tooltip": {
			border: "none",
			backgroundColor: tooltipBackground,
		},
		".cm-tooltip .cm-tooltip-arrow:before": {
			borderTopColor: "transparent",
			borderBottomColor: "transparent",
		},
		".cm-tooltip .cm-tooltip-arrow:after": {
			borderTopColor: tooltipBackground,
			borderBottomColor: tooltipBackground,
		},
		".cm-tooltip-autocomplete": {
			"& > ul > li[aria-selected]": {
				backgroundColor: highlightBackground,
				color: ivory,
			},
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
			outline: "none !important",
		},
	},
	{ dark: true },
);

export const tablixHighlightStyle = HighlightStyle.define([
	{ tag: t.keyword, color: violet },
	{ tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: coral },
	{ tag: [t.function(t.variableName), t.labelName], color: malibu },
	{ tag: [t.color, t.constant(t.name), t.standard(t.name)], color: whiskey },
	{ tag: [t.definition(t.name), t.separator], color: ivory },
	{
		tag: [
			t.typeName,
			t.className,
			t.number,
			t.changed,
			t.annotation,
			t.modifier,
			t.self,
			t.namespace,
		],
		color: chalky,
	},
	{
		tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
		color: cyan,
	},
	{ tag: [t.meta, t.comment], color: stone },
	{ tag: t.strong, fontWeight: "bold" },
	{ tag: t.emphasis, fontStyle: "italic" },
	{ tag: t.strikethrough, textDecoration: "line-through" },
	{ tag: t.link, color: stone, textDecoration: "underline" },
	{ tag: t.heading, fontWeight: "bold", color: coral },
	{ tag: [t.atom, t.bool, t.special(t.variableName)], color: whiskey },
	{ tag: [t.processingInstruction, t.string, t.inserted], color: sage },
	{ tag: t.invalid, color: invalid },
]);

export const tablix: Extension = [tablixTheme, syntaxHighlighting(tablixHighlightStyle)];
