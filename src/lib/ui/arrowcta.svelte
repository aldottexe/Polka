<script lang="ts">
    let { label, onclick, active = true } : { label: string; onclick:()=>void; active: boolean } = $props();
</script>
<button
    onclick={onclick}
    class="flex rounded-lg px-6 py-4 {active ? 'bg-a2' : 'bg-g1'} w-full hover:bg-a1 hover:text-g0 transition-colors duration-100 uppercase text-g0 items-center gap-2"
>
    <span>
    {label}
    </span>

    <div class="flex relative w-full">

    <svg class="w-full h-5">
        <line x1="5px" y1="50%" x2="calc(100% - 5px)" y2="50%" class="stroke-2 stroke-g0" stroke-linecap="round"></line>
    </svg>
    <svg viewBox="0 0 12 20" class="w-5 h-5 absolute -right-1">
        <polyLine points="2,4 8,10 2,16" x="calc(100% - 5px)" y="5px" class="stroke-2 stroke-g0" fill="none" stroke-linecap="round" stroke-linejoin="round"></polyLine>
        
    </svg>
            
    </div>
</button>
