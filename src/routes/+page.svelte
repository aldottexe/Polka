<script lang="ts">
	import LinkLG from '$lib/ui/linkLG.svelte';
	import SpecialCTA from '$lib/ui/specialCTA.svelte';
	const { data } = $props();
</script>

<p class="mb-8">
	Welcome to Polka, your simple group decision maker. Create or join a room below to start.
</p>

<SpecialCTA>Rejoin pizza</SpecialCTA>

<div class="flex w-full gap-2">
	<LinkLG href="/join">join</LinkLG>
	<LinkLG href="/create">create</LinkLG>
</div>
