<script lang="ts">
	import '../app.css';

	import { platformName } from '$lib/platform';

	let { children } = $props();
	const dev = true;
</script>

<svelte:window ondrop={(e) => e.preventDefault()} ondragover={(e) => e.preventDefault()} />

<div class="app-root" role="application" oncontextmenu={(e) => !dev && e.preventDefault()}>
	{#if platformName === 'macos'}
		<div class="drag-region" data-tauri-drag-region></div>
	{/if}
	{@render children()}
</div>

<style lang="postcss">
	.app-root {
		display: flex;
		height: 100%;
		user-select: none;
		cursor: default;
	}

	.drag-region {
		--z-modal: 4;
		z-index: var(--z-modal);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 14px;
	}
</style>
