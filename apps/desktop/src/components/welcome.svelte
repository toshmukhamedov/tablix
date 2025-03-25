<script lang="ts">
	import { IconFolder, IconPlus, IconSearch } from '@tabler/icons-svelte';

	let search = $state('');
	type Project = {
		id: number;
		name: string;
		location: string;
	};
	const projects: Project[] = $state([
		{ id: 1, name: 'tablix', location: '~/Developer/github.com/me/tablix' },
		{ id: 2, name: 'reminder-bot', location: '~/Developer/github.com/me/reminder-bot' },
		{ id: 3, name: 'zed-editor', location: '~/Developer/github.com/zed/zed' },
	]);
	const filteredProjects: Project[] = $derived(
		projects.filter((project) => project.name.indexOf(search) !== -1),
	);
</script>

<div class="flex w-full">
	<div class="hero bg-base-200 min-h-screen w-3/7">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h3 class="text-2xl font-medium">Welcome to Tablix</h3>
				<p class="py-4 text-sm text-gray-500">
					Create a new project to start from scratch.<br />
					Open existing project from disk.
				</p>
				<div class="flex flex-row gap-6 justify-center my-6">
					<div>
						<button
							class="btn btn-primary px-4 py-6 bg-base-100 border-base-300 hover:border-primary"
						>
							<IconPlus class="text-primary fill-gray-800" />
						</button>
						<p class="text-sm p-2">New</p>
					</div>
					<div>
						<button
							class="btn btn-primary px-4 py-6 bg-base-100 border-base-300 hover:border-primary"
						>
							<IconFolder class="text-primary fill-gray-800" />
						</button>
						<p class="text-sm p-2">Open</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex w-4/7 flex-col p-4 mt-4">
		<div class="flex flex-row items-center">
			<IconSearch class="size-4" />
			<input
				type="text"
				autocorrect="off"
				bind:value={search}
				placeholder="Search projects"
				class="input search-input"
			/>
		</div>
		<div class="divider my-2"></div>
		<ul class="list bg-base-100">
			{#each filteredProjects as project (project.id)}
				<li class="list-row p-2 rounded-box hover:bg-primary">
					<div class="w-100">
						<div class="pb-1">{project.name}</div>
						<div class="text-xs opacity-60">{project.location}</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.search-input {
		border: none;
		outline: none;
		box-shadow: none;
	}
</style>
