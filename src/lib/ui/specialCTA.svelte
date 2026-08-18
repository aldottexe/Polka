<script lang="ts">
	const { children } = $props();
</script>

<button class="2xl mb-6 block w-full rounded-2xl border-5 border-blue-400 bg-a1 py-5 text-g2">
	{@render children()}
</button>

<style>
	button {
		box-shadow: -2px 4px 5px var(--color-g2);
	}
</style>
