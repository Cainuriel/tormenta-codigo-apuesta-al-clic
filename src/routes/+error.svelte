<script>
	import { page } from "$app/stores"

 
</script>
 {#if $page.error !== null}
 <h1>{$page.error.message}</h1>
 {:else}
 <h1>Ui, ui, algo malo ha pasado.</h1>
 {/if}
