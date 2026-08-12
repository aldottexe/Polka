<script lang="ts">
    interface p {
        title: string;
        value: string;
        id: string;
        errorMsg?: string;
    }
    let {value = $bindable(""), title, id, errorMsg} : p = $props();

    function keyHandler(e: KeyboardEvent) {
        console.log(e.key)
        if (e.key === "Backspace") {
            value = value.slice(0, -1);
            //if key is a number, add it to the value string, but only if the value string is less than 6 characters long
        } else if (e.key.length === 1 && value.length < 6 && !isNaN(parseInt(e.key))) {
            value += e.key;
        }
    }

</script>
{#snippet codeHalf(code: string)}
<span class="block px-2 py-1 min-w-6 rounded-lg bg-g1 text-center {code === 'x' && 'text-g450'}">{code}</span>
{/snippet}


<div 
   class="flex gap-2 relative w-full items-center flex-wrap"
   onkeydown={keyHandler} 
   role="textbox"
   tabindex="0"
   inputmode="numeric"
>
{#if errorMsg}
    <span class="text-a3 absolute -top-3 -right-1 z-5 rotate-10 text-2xl font-bold">*</span>
{/if}
    <label 
    for={id} 
    class="block bg-g2 px-4 py-1 min-w-max w-19 rounded-lg font-bold uppercase text-center relative whitespace-nowrap"
    
    >{title}</label>
    <div class="flex gap-2" id={id} >
      {#each new Array(6) as _, i}
        {@render codeHalf(value[i] || 'x')} 
      {/each}
    </div>
</div>

{#if errorMsg}
<p class="text-a3 text-sm px-5">^^ {errorMsg}</p>
{/if}
