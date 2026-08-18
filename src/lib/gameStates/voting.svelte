<script lang="ts">
	import OrderableList from '$lib/orderableList.svelte';
	import type { orderableList_T } from '$lib/orderableList.svelte';
	import { SupabaseClient } from '@supabase/supabase-js';
	import type { Database, Tables } from '../../../database.types';
	import ButtonLG from '$lib/ui/buttonLG.svelte';
	let { entries, supabase }: { entries: Tables<'entries'>[]; supabase: SupabaseClient<Database> } =
		$props();
	let itemList: orderableList_T = $derived(entries.map((e) => ({ id: e.id, name: e.name })));

	async function submit() {
		const data = await supabase.rpc('submit_ballot', { rank: itemList.map((itm) => itm.id) });
		if (data.error) {
			alert(data.error.message);
		}
	}
</script>

<div class="w-full grow">
	<OrderableList bind:items={itemList} />
	<ButtonLG onclick={submit}>Cast Vote!</ButtonLG>
</div>
