import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";

const view = new EditorView({
	doc: "Start document",
	parent: document.body,
	extensions: [basicSetup],
});
