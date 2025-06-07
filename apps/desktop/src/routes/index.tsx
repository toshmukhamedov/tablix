import { Welcome } from "@/features/welcome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Welcome,
});
