import { makeAutoObservable } from "mobx";
import type { View } from "@/App";

export type Section = "explorer" | "queries" | "dock";

class AppStore {
	view: View = "welcome";
	openSections: Set<Section> = new Set(["explorer", "queries"]);

	constructor() {
		makeAutoObservable(this);
	}
	setView = (view: View): void => {
		this.view = view;
	};

	toggleSection(section: Section): void {
		if (this.openSections.has(section)) {
			this.openSections.delete(section);
		} else {
			this.openSections.add(section);
		}
	}

	openSection(section: Section): void {
		this.openSections.add(section);
	}

	hideSection(section: Section): void {
		this.openSections.delete(section);
	}

	dispose(): void {
		this.openSections = new Set(["explorer", "queries"]);
	}
}

export const appStore = new AppStore();
