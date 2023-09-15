<script lang="ts">
import type { PageData } from './$types'
 import { browser } from '$app/environment';
import Toasts from '../../components/Toasts.svelte';
import ConfettiComponent from '../../components/ConfettiComponent.svelte';
//  variables
	export let data: PageData
	$: ({ user } = data)
	$: clicks = 0
  $: times = user?.balance;
  let updateTimes:any = 5;
  let isLoser = false;
  export let form;
  let dataToast = {title: "", desc: "", status: ""}
  let showToast = false;
  let confetti = false;
  let blockButtonClick: boolean = false;
 //funciones 
function generateRandomNumber() {
  return (Math.floor(Math.random() * 10) + 1);
}

function clickeando() {
  clicks = clicks + 1;
  // console.log(`clicks`, clicks);
}

async function comprobar() {
  blockButtonClick = true;
  let match = generateRandomNumber();
  console.log(`clicks, match`, clicks, match);
  if(match === clicks) {
  confetti = true;
  // let reward:BigInt = userBild * BigInt(2);
  dataToast.title =  "¡Enhorabuena!";
  dataToast.desc = ` Ha ganado ${(user?.bild)} `;
  dataToast.status =   "info";
  dataToast = dataToast;
  showToast = true;
   setTimeout(async () => {
    await payToWinner();
   }, 2000);
  

  } else {      
            //@ts-ignore
    updateTimes =  times - BigInt(1);
    
    fetchNewTime(match);
  }
}

async function fetchNewTime(match:any) {
  
  if(updateTimes === BigInt(0) ) {
        dataToast.title =  "Se le acabaron las oportunidades.";
        dataToast.desc = ` Apostó por el numero ${clicks} y salió el ${match}.`;
        dataToast.status =   "info";
        dataToast = dataToast;
        showToast = true;
      if(browser) {
            // POR ALGÚN MOTIVO NO FUNCIONA EL BIND
            setTimeout(() => {
              //@ts-ignore
            document.getElementById("newTimeInput").value = updateTimes;
            //@ts-ignore
            document.getElementById("isLoser").value = true;
            //@ts-ignore
            document.getElementById('updateTimesButton').click();
            }, 4000);

        }
    } else {

      if(clicks + 1 === match || match + 1 === clicks) {

        dataToast.title =  "¡UIIIIIIIII CASÍ!";
        dataToast.desc = `Apostó el número ${clicks} y ha salido el número ${match}`;
        dataToast.status =   "warning";
      } else {

        dataToast.title =  "¡FALLÓ!";
        dataToast.desc = `Apostó el número ${clicks} y ha salido el número ${match}`;
        dataToast.status =   "error";
  
      }
        dataToast = dataToast;
        showToast = true;
        clicks = 0;
        if(browser) {
            setTimeout(() => {
            //@ts-ignore
            document.getElementById("newTimeInput").value = updateTimes;
          //@ts-ignore
          document.getElementById('updateTimesButton').click();
            }, 4000);
        }
    
    }
    
}


 async function payToWinner() {

  if(browser) {
      // POR ALGÚN MOTIVO NO FUNCIONA EL BIND
      //@ts-ignore
      document.getElementById("isLoser").value = "Winner";
      //@ts-ignore
      document.getElementById('updateTimesButton').click();
    }

}

function activeToastForm() {

dataToast.title =  form?.title || "";
dataToast.desc = form?.message || "";
dataToast.status =  form?.status || "";
dataToast = dataToast;
showToast = true;


}

$: if(form?.message) activeToastForm();

</script>

{#if confetti}

<ConfettiComponent />
  
{/if}

{#if user}
  <form action="?/updateTimes" method="POST" hidden >
			<input type="text" id="newTimeInput" bind:value={updateTimes} name="updateTimes" />
      <input type="text" id="isLoser" bind:value={isLoser} name="isLoser" />
			<button id="updateTimesButton" type="submit">Update times</button>
	</form>
{/if}

<div id="game">
  <small>Elija un número del 1 al 10</small>
  {#if times == 1}
  <h3 style="color: red;" >Última oportunidad. Piense bien su último número</h3>
  {:else}
  	<h2>Dispone de {times} intentos para ganar.</h2>
  {/if}


	<!-- Contador de clics -->
	<div class="counter">
	Clickee el número de su apuesta: 
	</div>
  <h2 id="counter">{clicks}</h2>
	<!-- Botón rojo grande y redondo -->
	<button on:click={clickeando} id="click" disabled={blockButtonClick} class="red-button">Clic</button>

	<hr />

	<!-- Botón para hacer la apuesta con emojis -->
	<button on:click={comprobar} id="apuesta"disabled={blockButtonClick} class="bet-button">🎲 Apuesta 🎲</button>	
  {#if showToast}
      <Toasts data={dataToast} active={showToast} />
  {/if}

</div>

<!-- {#if user}
  <form action="?/createGame" method="POST" hidden >
			<h3>{user.username}</h3>
			<label for="title">  </label>
			<input type="text" id="title" name="title" />
			<label for="title"> Content </label>
			<textarea id="content" name="content" rows={5} />
			<button type="submit">Add Game</button>
	</form>
{/if} -->

<style>

  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');


    * {
    /* font-family: 'VT323', monospace; */
    text-align: center;
    font-family: 'Press Start 2P', cursive;

    }

    /* Estilo para el título */
    h1 {
      font-size: 2rem;
      margin-bottom: 20px;
    }

    /* Estilo para el botón rojo */
    .red-button {
      size: 50vw;
      background-color: hsl(195, 85%, 41%);
      color: white;
      padding: 20px;
      border-radius: 50%; /* Hace el botón redondo */
      font-size: 1.5rem;
      border: none;
      cursor: pointer;
      transition: transform 0.3s ease, background-color 0.3s ease; /* Transición suave */
    }

    /* Efecto hover para el botón rojo */
    .red-button:hover {
      background-color: darkred;
      color: yellow;
      transform: scale(1.1); /* Escala el botón */
    }

    /* Estilo para el contador */
    .counter {
      font-size: 1.5rem;
      margin: 20px;
    }

    #counter {
      font-size: 3.5rem;
      margin: 20px;
    }

    /* Estilo para el botón de apuesta */
    .bet-button {
      background-color: hsl(195, 85%, 41%);
      color: white;
      padding: 15px 30px;
      font-size: 1.5rem;
      border: none;
      cursor: pointer;
    }

    .bet-button:hover {
      background-color: darkgreen;
    }
</style>