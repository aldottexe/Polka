<script lang="ts">
	import type { Database } from "../../../database.types";
    
    let {entries} : {entries: Database["public"]["Tables"]["entries"]["Row"][]} = $props();
    let entriesSorted = $derived(entries.sort((a, b) => a.votes > b.votes ? 1 : -1))
</script>
<h1>Results</h1>
<ol>
    {#each entriesSorted as e}
        <li class="flex justify-between px-5 py-2 my-2">
            <p>{e.name}</p>
            <p>{e.votes}</p>
        </li>
    {/each}
</ol>