<script lang="ts">
	import type { Action } from "svelte/action";


    interface p {
        title: string
        placeholder: string
        value: string
        id: string
    }
    let {placeholder, value = $bindable(""), title, id} : p = $props();
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
    <label 
    for={id} 
    class="
    block bg-g2 px-4 py-1 w-22 rounded-lg font-bold uppercase text-center relative min-w-max
    {!overflowing ? 'before:opacity-0 after:opacity-0' : ''}
    after:[content:''] after:block after:absolute after:top-0 after:left-0 after:-right-2 after:-bottom-2 after:rounded-2xl after:bg-g0 after:-z-1
    before:[content:''] before:block before:absolute before:-right-2 before:-bottom-2 before:w-4 before:h-4 before:bg-g1 before:-z-2
    before:transition-opacity before:duration-300 before:ease-in-out
    after:transition-opacity after:duration-300 after:ease-in-out
    " 
    bind:clientHeight={labelHeight}
    bind:clientWidth={labelWidth}

    >{title}</label>

    <!-- input -->
    <div 
    id={id} 
    class="block z-3 bg-g1 px-6 {overflowing? 'py-3' : 'py-1'} 
    rounded-lg absolute transition-all duration-300 ease-in-out 
    focus:outline-none overflow-hidden right-0 bottom-0 whitespace-nowrap
    before:absolute before:h-full before:content-(--placeholder)
    
    {value.length > 0 ? "before:opacity-0" : "before:opacity-50 before:transition-opacity"}"
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