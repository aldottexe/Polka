<script lang="ts">
	import type { Snippet } from "svelte";
	import { stopPropagation } from "svelte/legacy";
	import { fly, slide } from "svelte/transition";

    let {visible = $bindable(false), children} : {visible: boolean, children: Snippet} = $props()
</script>

{#if visible}
   <div class="popupContainer" onclick={()=>visible = false} transition:fly={{y: 100, duration: 200}}>
      <div class="card" onclick={e => e.stopPropagation()} role="none">
         {@render children()}
      </div>
   </div>
{/if}

<style>
    .popupContainer {
        width: 100vw;
        max-width: 600px;
        height: 100vh;
        position:fixed;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing:border-box;
        padding: 10px 60px;
    }
    .card {
        box-sizing: border-box;
        padding: 20px 40px;
        border-radius: 26px;
        background-color: var(--color-g0);
        /* box-shadow: 2px 2px 10px var(--color-g4); */
        border: 10px var(--color-a4) solid;
    }
</style>
