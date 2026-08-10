<script lang="ts">
    interface p {
        label: string;
        href:string;
        bgColor?: string;
        textColor?: string;
    }
    let { label, href, bgColor, textColor } : p = $props();
</script>
<a 
    href={href}
    class="rounded-lg text-center px-2 py-4 {bgColor || 'bg-g2'} block w-full hover:bg-a1 hover:text-g0 transition-colors duration-200 uppercase {textColor}"
>
    {label}
</a>