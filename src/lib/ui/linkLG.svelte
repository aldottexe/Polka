<script lang="ts">
    import type { Snippet } from "svelte";

    interface p {
        href:string;
        bgColor?: string;
        textColor?: string;
        children: Snippet;
    }
    let { href, bgColor, textColor, children } : p = $props();
</script>
<a 
    href={href}
    class="rounded-lg text-center px-2 py-4 {bgColor || 'bg-g2'} block w-full hover:bg-a1 hover:text-g0 transition-colors duration-200 uppercase {textColor}"
>
    {@render children()}
</a>