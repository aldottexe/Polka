<script lang="ts">
  import "../app.css";
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'

  let { data, children } = $props()
  let { supabase, session } = $derived(data)

  onMount(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })
    return () => sub.subscription.unsubscribe()
  })
</script>

<div class="fixed p-3">
  {#if session}
    <p class="text-green-800">logged in</p>
    <button onclick={()=>{supabase.auth.signOut()}}> end session </button>
  {:else}
    <p class="text-red-800">logged out</p>
  {/if}
</div>
<div class="flex items-center justify-end h-screen flex-col max-w-150 mx-auto py-20 px-20">
  <a href="/" class="self-start mb-2">
    <img src="/logo.svg" alt="logo" class="w-25" />
  </a>
  {@render children()}
</div>

<style>

</style>