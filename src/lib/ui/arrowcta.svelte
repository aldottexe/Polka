<script lang="ts">
    interface p {
        label: string;
        onclick?: () => void;
        visible?: boolean;
        bgColor?: string;
        textColor?: string;
    }
    let { label, onclick, visible = true, bgColor, textColor } : p = $props();
</script>

<div 
class="ctaContainer"
style="grid-template-rows: {visible ? '1fr' : '0fr'}; 
       margin-top: {visible ? '2rem' : '0'}"
>
    <div
    style="opacity: {visible ? 1 : 0}; 
           transform: scale({visible ? 1 : 0.9})"
    >
        <button
            onclick={onclick}
            class="{bgColor || 'bg-a2'} {textColor || 'text-g0'}"
        >
            <span>{label}</span>
            <div class="arrow">
                <svg class="w-full h-5">
                    <line x1="5px" y1="50%" x2="calc(100% - 5px)" y2="50%" class="stroke-2 stroke-g0" stroke-linecap="round"></line>
                </svg>
                <svg viewBox="0 0 12 20" class="w-5 h-5 absolute -right-1">
                    <polyLine points="2,4 8,10 2,16" x="calc(100% - 5px)" y="5px" class="stroke-2 stroke-g0" fill="none" stroke-linecap="round" stroke-linejoin="round"></polyLine>
                </svg>
            </div>
        </button>
    </div>
</div>

<style>
button {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-g0);
    text-transform: uppercase;
    white-space: nowrap;
    border-radius: 8px;
    padding: 16px 24px;
    width: 100%;
    transition: background-color 200ms;
    &:hover {
        background-color: var(--color-a1);
    }
}
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
.arrow {
    position: relative;
    display: flex;
    width: 100%;
}
</style>
