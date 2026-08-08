<script>
	import Arrowcta from "$lib/ui/arrowcta.svelte";
	import BackBar from "$lib/ui/backBar.svelte";
	import CodeField from "$lib/ui/codeField.svelte";
	import Field from "$lib/ui/field.svelte";

	let {data} = $props();
   let code = $state("");
   let name = $state("");
   let color = $state("");

   let canSubmit = $derived(
      code.length === 6 &&
      name.length > 0 &&
      parseInt(color) >= 0 &&
      parseInt(color) <= 8
   );

   function joinRoom() {
		// create new user
		if (data.session) data.supabase.auth.signOut();
		data.supabase.auth.signInAnonymously();

		data.supabase.rpc("join_room", {player_name: name, player_color: color, room_code: code}).then((res) => {
			if (res.error) console.error(res.error)
			console.log(res);
		});
	}
</script>

<div class="flex flex-col w-full">
   <div class="flex flex-col gap-3 w-full">
      <BackBar name="join room"/>
      <CodeField title="code" id="codefield" bind:value={code}/>
      <Field title="name" placeholder="adog" id="namefield" bind:value={name}/>
      <Field title="color" placeholder="0" id="colorfield" bind:value={color}/>
   </div>
   <div
      class="grid w-full transition-all duration-300 ease-out"
      style="grid-template-rows: {canSubmit ? '1fr' : '0fr'}; margin-top: {canSubmit ? '2rem' : '0'}"
   >
      <div
         class="overflow-hidden min-h-0 transition-all duration-300 ease-out"
         style="opacity: {canSubmit ? 1 : 0}; transform: scale({canSubmit ? 1 : 0.9})"
      >
         <Arrowcta label="join" onclick={()=>{}} active={canSubmit}/>
      </div>
   </div>
</div>
