<script lang="ts">
    const {name, buttonLabel, onclick, icon} : {name: string, buttonLabel?: string, onclick?: () => void, icon?: string} = $props();
</script>
<div class="flex justify-between align-center uppercase w-full">
    <div class="flex">
        {#if icon}
            <img src={icon} alt={name} class="w-6 h-6 mr-2"/>
        {/if}
            <h3>{name}</h3>
    </div>

    <button class="hover:text-a1 transition-colors uppercase" onclick={onclick}>
        {buttonLabel}
    </button>
</div>