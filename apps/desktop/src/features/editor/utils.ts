import type { EditorView } from "@codemirror/view";

export function getSelectedText(view: EditorView): string | null {
	const selection = view.state.selection.main;
	if (selection.empty) return null;
	const selectedText = view.state.doc.sliceString(selection.from, selection.to).trim();
	if (!selectedText) return null;
	return selectedText;
}
