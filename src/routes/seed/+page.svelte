<script lang="ts">
    import type { PageData } from './$types'
    let show_password = false
    $: type = show_password ? 'text' : 'password';
    export let data: PageData
    $: ({ value } = data)
    console.log(`value`, value);
    </script>
    
    <div>Cuidadín, ¡qué no te vean malandrín! <input  { type } { value } {...$$restProps}  /></div>

    <button type="button" on:click="{ () => show_password = !show_password }">{show_password ? 'Hide' : 'Show'}</button>


<style>

@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

* {
text-align: center;
font-family: 'Press Start 2P', cursive;

}

button {
    background-color: #F18F43
}
</style>