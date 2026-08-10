<script lang="ts">
	import type { Snippet } from "svelte";
	import type { Action } from "svelte/action";

    type tabs_T = {
        name: string,
        el: Snippet
    }[]
    let {tabs, selectedIndex = $bindable(0)} : {tabs: tabs_T, selectedIndex?: number} = $props();
    
    let selectedTab = $derived(tabs[selectedIndex].el);

    const followsScroll: Action<HTMLButtonElement, { i: number }> = (node, data) => {
        $effect(() => {
            if(selectedIndex === data.i) {
                node.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"})
            }
        });
    }
</script>
<div>
    <nav>
        {#each tabs.map(t => t.name) as name, i (name)}
            <button 
            use:followsScroll={{i}}
            onclick={()=>selectedIndex = i}
            class={selectedIndex === i ? 'selected' : ''}
            >{name}</button>
        {/each}
    </nav>
    {@render selectedTab()}
</div>


<style>
    div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    nav {
        display: flex;
        gap: 8px;
        width: 100%;
        margin: 8px 0;
        overflow-x: scroll;
        scrollbar-width: none;
        border-radius: 8px;

        button {
            text-transform: uppercase;
            width: 100%;
            min-width: 40%;
            box-sizing:border-box;
            padding: 8px 16px;
            border-radius: 8px;
            background-color: var(--color-g1);
            transition: background-color 200ms, color 200ms;
        }
    }
    .selected {
        background-color: var(--color-g4);
        color: var(--color-g0);
        font-weight: bold;
    }
</style>