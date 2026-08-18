<script lang="ts">
	import Joining from '$lib/gameStates/joining.svelte';
	import Voting from '$lib/gameStates/voting.svelte';
	import Results from '$lib/gameStates/results.svelte';
	import StatusBar from '$lib/ui/statusBar.svelte';
	import { onMount, type Component, type ComponentProps } from 'svelte';
	import type { Tables } from '../../../database.types.js';

	const { data } = $props();
	let playerList: Tables<'players'>[] = $state([]);
	let entryList: Tables<'entries'>[] = $state([]);
	let room: Tables<'rooms'> | undefined = $state();
	let userData: Tables<'players'> | undefined = $derived(
		playerList.find((p) => p.auth_id === data.session?.user.id)
	);

	type roomState_T<C extends Component<any, {}, ''>> = {
		c: C;
		a: ComponentProps<C>;
	};
	type roomStates_T = {
		joining: roomState_T<typeof Joining>;
		voting: roomState_T<typeof Voting>;
		results: roomState_T<typeof Results>;
	};

	let roomStates: roomStates_T = $derived({
		joining: {
			c: Joining,
			a: {
				entryList: entryList,
				room: room,
				userData: userData,
				playerList: playerList,
				supabase: data.supabase
			}
		},
		voting: {
			c: Voting,
			a: {
				entries: entryList,
				supabase: data.supabase
			}
		},
		results: {
			c: Results,
			a: {
				entries: entryList
			}
		}
	});

	let CurrentRoomState = $derived(
		room?.state ? roomStates[room.state as keyof roomStates_T] : undefined
	);
	let CurrentComponent = $derived(CurrentRoomState?.c);
	let CurrentProps = $derived(CurrentRoomState?.a ?? {});

	onMount(() => {
		const supabase = data?.supabase;
		if (!supabase) return;

		const channel = supabase
			.channel('voting')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, getPlayers)
			.on('postgres_changes', { event: '*', schema: 'public', table: 'entries' }, getEntries)
			.on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, (payload) => {
				room = payload.new as Tables<'rooms'>;
			})
			.subscribe();

		getPlayers();
		getEntries();
		getRoom();

		return () => {
			channel.unsubscribe();
		};
	});

	async function getEntries() {
		const { data: entryData, error } = await data.supabase.from('entries').select('*');
		if (error) return console.error(error);
		entryList = entryData;
	}

	async function getPlayers() {
		const { data: playerData, error } = await data.supabase.from('players').select('*');
		if (error) return console.error(error);
		playerList = playerData;
	}

	async function getRoom() {
		const { data: roomData, error } = await data.supabase.from('rooms').select('*').single();
		if (error) {
			console.error(error);
			room = undefined;
			return;
		}
		room = roomData ?? {};
	}
</script>

<!-- Room/Player Info -->
<StatusBar
	name={room?.name || 'loading...'}
	buttonLabel="BACK"
	onclick={() => console.log('back')}
/>
<StatusBar
	name={userData?.name || 'loading...'}
	buttonLabel="edit"
	onclick={() => console.log('edit')}
/>

{#if CurrentComponent}
	<CurrentComponent {...CurrentProps} />
{/if}
