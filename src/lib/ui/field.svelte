<script lang="ts">
	import type { Action } from "svelte/action";


    interface p {
        title: string
        placeholder: string
        value: string
        id: string
        errorMsg?: string
    }
    let {placeholder, value = $bindable(""), title, id, errorMsg} : p = $props();
    let labelHeight:number = $state(0)
    let labelWidth:number = $state(0)
    let inputHeight:number = $state(0)

    let overflowing:boolean = $state(false)
    let inputPosition = $derived(overflowing ? `
        left:0px; 
        ` : `
        left:${labelWidth + 8}px;
        `);
    const delayNoWrap:Action = (node: HTMLElement) => {
        $effect(() => {
            if(overflowing)
                setTimeout(() => {
                    node.style.whiteSpace = "wrap"
                }, 300)
        })
        $effect(() => {
        if (node.scrollWidth > node.clientWidth)
            overflowing = true
        if (value.length < 10)
            overflowing = false
        });
        $effect(()=>
            node.style.setProperty('--placeholder', `"${placeholder}"`)
        );
    };

</script>


<div class="flex gap-2 relative w-full items-start">
    {#if errorMsg}
        <span class="text-a3 absolute -top-3 -right-1 z-5 rotate-10 text-2xl font-bold">*</span>
    {/if}

    <label 
    for={id} 
    class="
    {!overflowing ? 'before:opacity-0 after:opacity-0' : ''}
    " 
    bind:clientHeight={labelHeight}
    bind:clientWidth={labelWidth}

    >
    {title}


    </label>

    <!-- input -->
    <div 
    id={id} 
    class="input 
    {overflowing? 'py-3' : 'py-1'} 
    {value.length > 0 ? "before:opacity-0" : "before:opacity-50 before:transition-opacity"}
    "
    contenteditable=true
    role="textbox"
    tabindex=0
    bind:textContent={value}
    bind:clientHeight={inputHeight}
    use:delayNoWrap
    style={inputPosition}
    ></div>

    <!-- fill for overflowing -->
    <div 
        class="bg-g1 rounded-lg w-full transition-all ease-in-out duration-300" 
        style="height:{overflowing ? inputHeight + labelHeight + 8 : 0}px">
    </div>
</div>
{#if errorMsg}
<p class="text-a3 text-sm px-5">^^ {errorMsg}</p>
{/if}
<style>
    label {
        position: relative;
        display: block;
        padding: 0.25rem 1rem;
        
        min-width: max-content;
        width: 5.5rem;
        
        border-radius: var(--radius-lg);

        background-color: var(--color-g2);

        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
    }
    label::before, label::after {
        content: '';
        display: block;
        position: absolute;
        transition: opacity 300ms ease-in-out;
    }
    label::before {
        bottom: -0.5rem;
        right: -0.5rem;
        width: 1rem;
        height: 1rem;
        background-color: var(--g1);
        z-index: -2;
    }
    label::after {
        top: 0;
        left: 0;
        right: -0.5rem;
        bottom: -0.5rem;
        z-index: -1;
        border-radius: var(--radius-2xl);
        background-color: var(--color-g0);
    }
    .input {
        display: block;
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 3;

        padding-left: 1.5rem;
        padding-right: 1.5rem;
        border-radius: var(--radius-lg);

        overflow: hidden;
        white-space: nowrap;

        background-color: var(--color-g1);

        transition: all 300ms ease-in-out;
    }
    .input::before {
        content: var(--placeholder);
        position: absolute;
        height: 100%;
    }
</style>