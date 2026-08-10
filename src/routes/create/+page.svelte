<script>
	import { goto } from "$app/navigation";
	import Arrowcta from "$lib/ui/arrowcta.svelte";
	import BackBar from "$lib/ui/backBar.svelte";
	import CodeField from "$lib/ui/codeField.svelte";
	import Field from "$lib/ui/field.svelte";

	let {data} = $props();
   let player_name = $state("");
   let color = $state("");
   let room_name = $state("");

   let canSubmit = $derived(
      room_name.length > 0 &&
      player_name.length > 0 &&
      parseInt(color) >= 0 &&
      parseInt(color) <= 8
   );

   async function createRoom() {
		// create new user
		if (data.session) data.supabase.auth.signOut();
		await data.supabase.auth.signInAnonymously();

		const res = await data.supabase.rpc("create_room", {player_name: player_name, player_color: color, room_name: room_name, room_max_entries: 1})
		
      if (res.error) {
         console.error(res.error)
         return;
      } 

      if (res.success)
         await goto("/vote")

	}
</script>

<div class="flex flex-col w-full">
   <div class="flex flex-col gap-3 w-full">
      <BackBar name="create room"/>
      <Field title="player name" placeholder="adog" id="namefield" bind:value={player_name}/>
      <Field title="player color" placeholder="0" id="colorfield" bind:value={color}/>
	  <Field title="room name" placeholder="pizza4tn" id="namefield" bind:value={room_name}/>
   </div>
   <div
      class="grid w-full transition-all duration-300 ease-out"
      style="grid-template-rows: {canSubmit ? '1fr' : '0fr'}; margin-top: {canSubmit ? '2rem' : '0'}"
   >
      <div
         class="overflow-hidden min-h-0 transition-all duration-300 ease-out"
         style="opacity: {canSubmit ? 1 : 0}; transform: scale({canSubmit ? 1 : 0.9})"
      >
         <Arrowcta onclick={createRoom} active={canSubmit} visible={canSubmit}>create</Arrowcta>
      </div>
   </div>
</div>
