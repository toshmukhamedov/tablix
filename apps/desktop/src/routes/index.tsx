import { Welcome } from "@/features/welcome/Welcome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Welcome,
});
