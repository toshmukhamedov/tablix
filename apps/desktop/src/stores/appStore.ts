import { makeAutoObservable } from "mobx";
import type { View } from "@/App";

class AppStore {
	view: View = "welcome";

	constructor() {
		makeAutoObservable(this);
	}
	setView = (view: View): void => {
		this.view = view;
	};
}

export const appStore = new AppStore();
