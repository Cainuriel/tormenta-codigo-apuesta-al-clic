<script lang="ts">
	import '@picocss/pico'
	import type { PageData } from './$types'
	export let data: PageData
</script>

<div id="main" class="container">
	<nav>
		<ul>
			<li>
				<h1 class="gradient-text">
					Juego del Botón en la red de <a class="gradient-text" href="https://ripple.com/" target="_blank">RIPPLE</a> 
				</h1>
				
			</li>
		</ul>
		<ul>
			<form method="POST">
				<li><a href="/">Home</a></li>
				{#if !data.user}
					<li><a href="/register">Register</a></li>
					<li><a href="/login">Login</a></li>
				{:else}
					<li>
						<button formaction="/logout" type="submit">Logout</button>
					</li>
				{/if}
			</form>
		</ul>
	</nav>
	<slot />
</div>
 <footer>
	<a id="linkFooter" href="https://cainuriel.github.io/" target="_blank" >&copy; Copyright 2023 cainuriel</a>

 </footer>

<style>
   @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');


    nav {

    font-family: 'Press Start 2P', cursive;

    }
	#main {
		margin-top: 2rem;

	}

    li > button {
        background-color: #A7489B;
    }

    li > a {
        color: #476098;
    }

	.gradient-text {
    font-family: 'Press Start 2P', cursive;
     font-size: 1.5rem;
  /* Fallback: Set a background color. */
  background-color: #CA4246;
  
  /* Create the gradient. */
   background-image: linear-gradient(
        45deg,
        #CA4246 16.666%, 
        #E16541 16.666%, 
        #E16541 33.333%, 
        #F18F43 33.333%, 
        #F18F43 50%, 
        #8B9862 50%, 
        #8B9862 66.666%, 
        #476098 66.666%, 
        #476098 83.333%, 
        #A7489B 83.333%);
  
  /* Set the background size and repeat properties. */
  background-size: 100%;
  background-repeat: repeat;

  /* Use the text as a mask for the background. */
  /* This will show the gradient as a text color rather than element bg. */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; 
  
  /* Animate the text when loading the element. */
    /* This animates it on page load and when hovering out. */
    animation: rainbow-text-simple-animation-rev 0.75s ease forwards;

}

.gradient-text:hover{
    animation: rainbow-text-simple-animation 0.5s ease-in forwards;
}


/* Move the background and make it smaller. */
/* Animation shown when entering the page and after the hover animation. */
@keyframes rainbow-text-simple-animation-rev {
    0% {
        background-size: 650%;
    }
    40% {
        background-size: 650%;
    }
    100% {
        background-size: 100%;
    }
}

/* Move the background and make it larger. */
/* Animation shown when hovering over the text. */
@keyframes rainbow-text-simple-animation {
    0% {
        background-size: 100%;
    }
    80% {
        background-size: 650%;
    }
    100% {
        background-size: 650%;
    }
}

	footer {
    background-color: #0b0c0cab;;
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	color: white;
	text-align: center;
	}

	#linkFooter {
		font-size: 0.6rem;
		text-decoration: none;
	}

</style>