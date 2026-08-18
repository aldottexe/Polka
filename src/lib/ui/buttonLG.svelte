<script lang="ts">
    import type { Snippet } from "svelte";

    interface p {
        onclick?: () => void;
        bgColor?: string;
        textColor?: string;
        children: Snippet;
        visible?: boolean;
    }
    let { onclick = () => {}, bgColor, textColor, children, visible = true } : p = $props();
</script>

<div
class="ctaContainer"
style="grid-template-rows: {visible ? '1fr' : '0fr'}; 
       "
>
    <div
    style="opacity: {visible ? 1 : 0}; 
           transform: scale({visible ? 1 : 0.9})"
    >
<button 
    onclick={onclick}
    class="rounded-lg px-2 py-4 {bgColor || 'bg-g2'} block w-full hover:bg-a1 hover:text-g0 transition-colors duration-200 uppercase {textColor}"
>
    {@render children()}
</button>
</div>
</div>

<style>
.ctaContainer {
    display: grid;
    width: 100%;
    transition: all 200ms ease-out;
    > div {
        overflow: hidden;
        min-height: 0;
        transition: all 300ms ease-out;
   }
}  
</style>
