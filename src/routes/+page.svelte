<script lang="ts">
	import ButtonLG from "$lib/ui/buttonLG.svelte";
	import LinkLG from "$lib/ui/linkLG.svelte";
	import LlinkLG from "$lib/ui/linkLG.svelte";
	const {data} = $props()
</script>

	<p class="mb-8">
		Welcome to Polka, your simple group decision maker. Create or join a room below to start.
	</p>

<div class="flex w-full gap-2">
	<LinkLG label="join" href="/join" />
	<LinkLG label="create" href="/create" />
</div>
