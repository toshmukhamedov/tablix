<script lang="ts">
	import { ProjectsService } from '$lib/projects/projects-service';
	import { IconFolderOpen } from '@tabler/icons-svelte';
	import { getContext } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	type Props = {
		open: boolean;
	};
	let { open = $bindable() }: Props = $props();
	const projectsService = getContext<ProjectsService>(ProjectsService);

	const defaultPath = '~/TablixProjects/';
	let form = $state({
		name: '',
		path: defaultPath,
	});

	const onClose = () => {
		open = false;
	};
	const onOk = async () => {
		if (!form.name || !form.path) return;
		await projectsService.addProject(form);
		open = false;
	};
	const onOpen = async () => {
		const path = await projectsService.getValidPath();
		if (!path) return;
		form.path = projectsService.getRelativePath(path);
		form.name ||= path.split('/').at(-1) ?? '';
	};
	const onNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (form.path && form.path.indexOf(defaultPath) === -1) return;
		form.path = defaultPath + e.currentTarget.value;
	};
</script>

<dialog class="modal" {open}>
	<div class="modal-box max-w-fit">
		<h3 class="text-sm font-bold text-center">New Project</h3>
		<div class="modal-action flex flex-col w-sm">
			<p class="text-sm">Enter new project name:</p>
			<input
				type="text"
				class="input w-full project-input"
				bind:value={form.name}
				oninput={onNameChange}
			/>
			<p class="text-sm">*Enter path:</p>
			<div class="join">
				<input
					required
					type="text"
					class="input w-full join-item validator project-input"
					bind:value={form.path}
				/>
				<button class="btn join-item" onclick={onOpen}>
					<IconFolderOpen class="size-4" />
				</button>
			</div>
			<div class="flex justify-end gap-2">
				<button class="btn btn-sm" onclick={onClose}>Close</button>
				<button class="btn btn-sm" onclick={onOk}>Ok</button>
			</div>
		</div>
	</div>
</dialog>

<style>
	.project-input {
		outline: none;
	}
</style>
