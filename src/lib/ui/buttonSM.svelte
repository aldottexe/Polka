<script lang="ts">
    interface p {
        label: string;
        onclick?: () => void;
        bgColor?: string;
        textColor?: string;
    }
    let { label, onclick = () => {}, bgColor, textColor } : p = $props();
</script>
<button 
    onclick={onclick}
    class="rounded-lg px-4 py-1 {bgColor || 'bg-g2'} block hover:bg-a1 hover:text-g0 transition-colors duration-200 uppercase {textColor}"
>
    {label}
</button>