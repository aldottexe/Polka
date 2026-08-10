<script lang="ts">
	import Arrowcta from '$lib/ui/arrowcta.svelte';
	import ButtonLG from '$lib/ui/buttonLG.svelte';
	import ButtonSM from '$lib/ui/buttonSM.svelte';
	import StatusBar from '$lib/ui/statusBar.svelte';
	import Tabs from '$lib/ui/tabs.svelte';
	import { onMount } from 'svelte';
	import { loadConfigFromFile } from 'vite';

    const {data} = $props();
    let playerList: any[] = $state([])
    let entryList: any[] = $state([])
    let room: any = $state({})

    let selectedTab = $state(0);

    const tabs = [
        {name: 'players', el: players}, 
        {name: 'entries', el: entries}, 
        ];

    onMount(()=>{
        data.supabase
         .channel("voting")
         .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "players" },
            getPlayers
         )
         .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "entries" },
            getEntries
         )
         .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "rooms" },
            (payload) => {
                console.log("room change", payload)
                room = payload.new;
            }
         )
         .subscribe()
    })

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
        const {data: roomData, error} = await data.supabase.from("rooms").select("*").single()
            if(error) return console.error(error)
            console.log(roomData)
            room = roomData;
    }

    getPlayers()
    getEntries()
    getRoom()

</script>
<StatusBar name={room.name || 'loading...'} buttonLabel="BACK" onclick={() => console.log("back")} />
<StatusBar name={playerList.find((p) => p.uid === data.session?.user.id)?.name || 'loading...'}/>
<Tabs tabs={tabs} bind:selectedIndex={selectedTab}/>

{#snippet entries()}
    <ul class="grow">
        {#each entryList as entry}
            <li>{entry.name}</li>
        {/each}
    </ul>
    <div class="flex justify-between items-center my-2">
        <p class="px-2">2/3 LEFT</p> 
        <ButtonSM label="Ready" onclick={() => console.log("ready")} bgColor="bg-a2" textColor="text-g0"/>
    </div>
    <ButtonLG label="New Entry +" onclick={() => selectedTab = 0} bgColor="bg-g4" textColor="text-g0"/>
{/snippet}

{#snippet players()}
    <ul class="grow">
        {#each playerList as player}
            <li>{player.name}{player.id === room.owner ? " (Host)" : ""}</li>
        {/each}
    </ul>
    <Arrowcta label="View Entries" onclick={() => selectedTab = 1} bgColor="bg-g4"/>
{/snippet}