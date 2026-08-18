<script lang="ts">
	import Arrowcta from '$lib/ui/arrowcta.svelte';
	import ButtonLG from '$lib/ui/buttonLG.svelte';
	import ButtonSM from '$lib/ui/buttonSM.svelte';
	import Field from '$lib/ui/field.svelte';
	import PopupFull from '$lib/ui/popupFull.svelte';
	import Tabs from '$lib/ui/tabs.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Database, Tables } from '../../../database.types';

	interface p {
		entryList: Tables<'entries'>[];
		room: Tables<'rooms'> | undefined;
		userData: Tables<'players'> | undefined;
		playerList: Tables<'players'>[];
		supabase: SupabaseClient<Database>;
	}

	let { entryList, room, userData, playerList, supabase }: p = $props();

	let remainingEntries = $derived(
		(room?.max_entries_per_player || 0) - entryList.filter((e) => e.owner === userData?.id).length
	);
	let isHost = $derived(room?.owner === userData?.id);

	let showAddScreen = $state(false);
	let newEntryVal = $state('');
	async function submitNewEntry() {
		const res = await supabase.rpc('create_entry', { name: newEntryVal });
		if (res.error) {
			console.error(res.error.message);
		}
		newEntryVal = '';
		showAddScreen = false;
	}

	let selectedTab = $state(0);

	const tabs = [
		{ name: 'players', el: players },
		{ name: 'entries', el: entries }
	];

	async function submit() {
		console.log('submit!');
		const data = await supabase.rpc('submit_entries');
		if (data.error) console.error(data.error);
	}
	async function moveToVote() {
		const data = await supabase.rpc('move_to_vote');
		if (data.error) console.error(data.error);
	}
</script>

<Tabs {tabs} bind:selectedIndex={selectedTab} />

<!-- Player Tab -->
{#snippet players()}
	<ul class="grow">
		{#each playerList as player}
			<li>{player.name}{player.id === room?.owner ? ' (Host)' : ''}</li>
		{/each}
	</ul>
	<Arrowcta onclick={() => (selectedTab = 1)} bgColor="bg-g4">View Entries</Arrowcta>
{/snippet}

<!-- Entry Tab -->
{#snippet entries()}
	<ul class="grow">
		{#each entryList as entry}
			<li>{entry.name}</li>
		{/each}
	</ul>
	<!-- Remaining votes & Ready Button -->
	<div class="my-2 flex items-center justify-between">
		<p class="px-2">{remainingEntries}/{room?.max_entries_per_player} LEFT</p>
		{#if !userData?.ready && remainingEntries > 0}
			<ButtonSM onclick={submit} bgColor="bg-a2" textColor="text-g0">Ready</ButtonSM>
		{/if}
		{#if userData?.ready && playerList.filter((p) => !p.ready).length > 0}
			<ButtonSM onclick={moveToVote} bgColor="bg-a4" textColor="text-g0">Ready all</ButtonSM>
		{/if}
	</div>
	<!-- New Entry -->
	{#if userData?.ready}
		{#if isHost && playerList.filter((p) => !p.ready).length === 0}
			<Arrowcta extraSpacing={false} onclick={moveToVote}>Move to vote</Arrowcta>
		{:else}
			<div class="block w-full rounded-lg bg-g2 px-2 py-4 text-center uppercase">
				waiting for others...
			</div>
		{/if}
	{:else if remainingEntries > 0}
		<ButtonLG onclick={() => (showAddScreen = true)} bgColor="bg-g4" textColor="text-g0"
			>New Entry +</ButtonLG
		>
	{:else}
		<ButtonLG onclick={submit} bgColor="bg-a2" textColor="text-g0">Ready</ButtonLG>
	{/if}
{/snippet}

<PopupFull bind:visible={showAddScreen}>
	<div class="flex flex-col gap-4">
		<h1 class="text-xl font-bold">New Entry</h1>
		<Field id="entryName" title="name" bind:value={newEntryVal} placeholder="pepparoni" />
		<ButtonLG onclick={submitNewEntry} visible={newEntryVal.length > 0}>Create Entry</ButtonLG>
	</div>
</PopupFull>
