<script lang="ts">
    import type { Snippet } from "svelte";

    interface p {
        onclick?: () => void;
        bgColor?: string;
        textColor?: string;
        children: Snippet;
    }
    let { onclick = () => {}, bgColor, textColor, children } : p = $props();
</script>
<button 
    onclick={onclick}
    class="rounded-lg px-4 py-1 {bgColor || 'bg-g2'} block hover:bg-a1 hover:text-g0 transition-colors duration-200 uppercase {textColor}"
>
    {@render children()}
</button>