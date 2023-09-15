<script lang="ts">
import Select from 'svelte-select';
import type { PageData } from './$types'
import processing from "$lib/images/processing.gif"
import { browser } from '$app/environment'
import { onMount } from 'svelte';
import Toasts from '../components/Toasts.svelte';

// variables
let apuestas = ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1500', '2000','3000','4000','5000'];
export let data: PageData
$: ({ games } = data)
let amount: string;
$: isProcessing = false;
let blockButtonBild: boolean = true;
let showToast = false;
let dataToast = {title: "", desc: "", status: ""}
export let form
//funciones
function capture(e: any) {
	blockButtonBild=false;
	console.log(e.detail.value);
	amount= e.detail.value
}	
function deleteInput(e: any) {
	console.log("nada");
	blockButtonBild=true;
}	


onMount(async () => {
    if(browser) {
	const btn = document.querySelector("buttonSubmit");

	function startProcessing() {
	isProcessing = true;
	}
	//@ts-ignore
	btn.addEventListener("click", () => {
		startProcessing();
	});
	}

  	});

    function activeToast() {

		dataToast.title =  form?.title || "";
		dataToast.desc = form?.message || "";
		dataToast.status =  form?.status || "";
		dataToast = dataToast;
		showToast = true;


	}

$: if(form?.message) activeToast();

function preSubmit() {
	isProcessing = true;
	if(browser) {
	//@ts-ignore
	document.getElementById('buttonSubmit').click();
	}
}

</script>
<div class="grid">
	<div id="listOfGames" class="border-box">
		<h2>Últimas partidas</h2>
		{#each games as game}
			<game>
				{#if game.title.includes("perdió")}
				<header  class="loser" > El malandrín: {game.title}</header>
				<p>
					{game.content}
				</p>
				{:else}	
				<header  class="win" >El malandrín: {game.title}</header>
				<p class="win">
					{game.content}
				</p>

				{/if}
			</game>
		{/each}
	</div>
	{#if data.user}
	<form id="formGame" class="border-box" action="?/sendBild" method="POST"  >
		<!-- <h1>{form?.message || ""}</h1> -->
		<h2>Malandrín: {data.user.username}</h2>
		<p>Su dirección pública: <a href={`https://testnet.xrpl.org/accounts/${data.user.wallet.wallet.classicAddress}`} target="_blank" ><small>{data.user.wallet.wallet.classicAddress}</small></a> </p>
		<small>La apuesta máxima que puede hacer es de 5000 XRP</small>
		<h4 id="balance">Su balance es de {data.balance} XRP</h4>
		<input type="text" hidden name="balance" value={data.balance}>
		<label for="apuesta"> Apuesta </label>
		<div>
		<Select name="bild" value={amount} on:clear={deleteInput} on:change={capture} items={apuestas} --chevron-background="#374956" --item-color="#374956" --placeholder-color="#374956" --chevron-color="#374956" --background="false" --list-empty-color="#374956" />
		</div>
		{#if isProcessing}
		<button  style="margin-top: 2rem;" ><img width="48" src={processing} alt="processing gif"></button>
		{:else}
	    <button id="buttonSubmit"  hidden ></button>
		<button id="preButtonSubmit" disabled={blockButtonBild}  on:click={preSubmit} style="margin-top: 2rem;" >Empezar a jugar</button>
		<a href="/seed"><button id="buttonSeed" style="margin-top: 5rem;" >Ver clave privada</button></a> 
		{/if}

		<!-- <small>{data.user.wallet.wallet.seed}</small> -->
	</form>
	{/if}

</div>
	<Toasts data={dataToast} active={showToast} />
			<!-- {#if game.userId === data.user?.userId}
					<form action="?/deleteGame&id={game.id}" method="POST">
						<button type="submit" class="outline secondary">Delete Game</button>
					</form>
					<a href="/{game.id}" role="button" class="outline constrast" style="width: 100%;"
						>Edit Game</a
					>
				{/if} -->

					<!-- <form action="?/createGame" method="POST">
					<h3>{data.user.username}</h3>
					<label for="title">  </label>
					<input type="text" id="title" name="title" />
					<label for="title"> Content </label>
					<textarea id="content" name="content" rows={5} />
					<button type="submit">Add Game</button>
					</form> -->

<style>

  /* @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap'); */
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');


	* {
	/* font-family: 'VT323', monospace; */
	text-align: center;
	font-family: 'Press Start 2P', cursive;

	}
	#listOfGames, #formGame {
		margin-top: 2rem;
		margin-bottom: 4rem;
	}
	
	.loser {
		color: #CA4246 
	}

	.win {
		color: #F18F43
	}

	a {
		text-decoration:none;
		color: #8B9862
	}

	p {
		color: grey;
	}

	button {
		background-color: #F18F43
	}

	#buttonSeed {
		background-color: #CA4246 
	}

	a:hover {
		color: rgb(206, 104, 37);
		background-position: 0 0, 0 0;
		-webkit-transition-duration: 0.5s;
		-moz-transition-duration: 1.5s;
		transition-duration: 1.5s;
	}

	.border-box {
	border: 1px solid;
	padding: 10px;
	box-shadow: 5px 10px #888888;
}
</style>