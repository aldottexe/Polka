<script lang="ts">
	import type { Snippet } from "svelte";
	import { slide } from "svelte/transition";

    let {visible, children} : {visible: boolean, children: Snippet} = $props()
</script>

<div class="popupContainer">
    {#if visible}
    <div class="card" transition:slide>
        {@render children()}
    </div>
    {/if}
</div>

<style>
    .popupContainer {
        width: 100vw;
        height: 100vh;
        position:fixed;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        box-sizing:border-box;
        padding: 10px;
    }
    .card {
        box-sizing: border-box;
        padding: 20px;
        border-radius: 16px;
        background-color: var(--color-g0);
        box-shadow: 2px 2px 10px var(--color-g4);
    }
</style>