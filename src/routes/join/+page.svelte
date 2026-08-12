<script lang="ts">
	import { goto } from "$app/navigation";
	import Arrowcta from "$lib/ui/arrowcta.svelte";
	import BackBar from "$lib/ui/backBar.svelte";
	import CodeField from "$lib/ui/codeField.svelte";
	import Field from "$lib/ui/field.svelte";
	import type { PostgrestError } from "@supabase/supabase-js";

	let {data} = $props();
   let code = $state("");
   let name = $state("");
   let color = $state("");

   let codeErr: string | undefined = $state();

   let canSubmit = $derived(
      code.length === 6 &&
      name.length > 0 &&
      parseInt(color) >= 0 &&
      parseInt(color) <= 8
   );

async function joinRoom() {
		// create new user
		if (data.session) data.supabase.auth.signOut();
		await data.supabase.auth.signInAnonymously();

		const res = await data.supabase.rpc("join_room", {player_name: name, player_color: color, room_code: code})
		
      if (res.error) {
         handleError(res.error);
         return;
      } 

      if (res.success)
         await goto("/vote")

	}

function handleError(err: PostgrestError) {
   if(err.code === 'P0001') return codeErr = err.message;
   codeErr = undefined;
}
</script>

<div class="column">
   <div class="column gap-3">
      <BackBar name="join room"/>
      <CodeField title="code" id="codefield" bind:value={code} errorMsg={codeErr}/>
      <Field title="name" placeholder="Einstein" id="namefield" bind:value={name} />
      <Field title="color" placeholder="0" id="colorfield" bind:value={color}/>
   </div>
   <Arrowcta onclick={joinRoom} visible={canSubmit}>join</Arrowcta>
</div>
