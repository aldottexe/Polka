<script lang="ts">
    const {data} = $props();
    let playerList: any[] = $state([])

    const channel = data.supabase
         .channel("players")
         .on(
            "postgres_changes",
            { event: "*", schema: "authenticated", table: "player" },
            getPlayers
         )
         .subscribe();
    
    async function getPlayers() {
        const {data: playerData, error} = await data.supabase.from("players").select("*")
            if(error) return console.error(error)
            playerList = playerData;
    }
    getPlayers()
</script>

<ul>
{#each playerList as player}
    <li>{player.name}</li>
{/each}
</ul>
