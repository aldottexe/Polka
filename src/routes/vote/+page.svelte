<script lang="ts">
	import Arrowcta from '$lib/ui/arrowcta.svelte';
	import ButtonLG from '$lib/ui/buttonLG.svelte';
	import ButtonSM from '$lib/ui/buttonSM.svelte';
	import PopupFull from '$lib/ui/popupFull.svelte';
	import StatusBar from '$lib/ui/statusBar.svelte';
	import Tabs from '$lib/ui/tabs.svelte';
	import { onMount } from 'svelte';

    const {data} = $props();
    let playerList: any[] = $state([])
    let entryList: any[] = $state([])
    let room: any = $state({})
    let userData = $derived(playerList.find(p => p.auth_id === data.session?.user.id) || {})
    let remainingEntries = $derived(room.max_entries_per_player - entryList.filter(e => e.owner === userData.auth_id).length)
    
    let selectedTab = $state(0);

    const tabs = [
        {name: 'players', el: players},
        {name: 'entries', el: entries},
        ];

    onMount(() => {
        const supabase = data?.supabase;
        if (!supabase) return;

        console.log(data.session)

        const channel = supabase
            .channel('voting')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'players' },
                getPlayers
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'entries' },
                getEntries
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'rooms' },
                (payload) => {
                    room = payload.new ?? {};
                }
            )
            .subscribe();

        getPlayers();
        getEntries();
        getRoom();

        return () => {
            channel.unsubscribe();
        };
    });

    async function getEntries() {
        const {data: entryData, error} = await data.supabase.from("entries").select("*")
            if(error) return console.error(error)
            entryList = entryData;
    }

    async function getPlayers() {
        const {data: playerData, error} = await data.supabase.from("players").select("*")
            if(error) return console.error(error)
            playerList = playerData;
    }

    async function getRoom() {
        const { data: roomData, error } = await data.supabase.from('rooms').select('*').single();
        if (error) {
            console.error(error);
            room = {};
            return;
        }
        room = roomData ?? {};
    }

   

</script>
<!-- Room/Player Info -->
<StatusBar name={room.name || 'loading...'} buttonLabel="BACK" onclick={() => console.log("back")} />
<StatusBar name={userData.name || 'loading...'} buttonLabel="edit" onclick={() => console.log("edit")} />

<Tabs tabs={tabs} bind:selectedIndex={selectedTab}/>

<!-- Player Tab -->
{#snippet players()}
    <ul class="grow">
        {#each playerList as player}
            <li>{player.name}{player.id === room.owner ? " (Host)" : ""}</li>
        {/each}
    </ul>
    <Arrowcta onclick={() => selectedTab = 1} bgColor="bg-g4">View Entries</Arrowcta>
{/snippet}

<!-- Entry Tab -->
{#snippet entries()}
    <ul class="grow">
        {#each entryList as entry}
            <li>{entry.name}</li>
        {/each}
    </ul>
    <!-- Remaining votes & Ready Button -->
    <div class="flex justify-between items-center my-2">
        <p class="px-2">{remainingEntries}/{room.max_entries_per_player} LEFT</p> 
        <ButtonSM onclick={() => console.log("ready")} bgColor="bg-a2" textColor="text-g0">Ready</ButtonSM>
    </div>
    <!-- New Entry -->
    <ButtonLG onclick={() => selectedTab = 0} bgColor="bg-g4" textColor="text-g0">New Entry +</ButtonLG>
{/snippet}

<PopupFull visible={true}>
    <h1>new entry</h1>
</PopupFull>