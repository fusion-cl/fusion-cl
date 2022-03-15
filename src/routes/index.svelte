<script lang="ts">
	import { onMount } from 'svelte';
	const TITLE_OPTIONS = ["Fusion - ACTUALLY Code, Create, and Learn Together", "The online IDE that actually fu- freaking works lmao", "Just let me code please", "Includes Monaco!", "Looking like a minecraft splash text over here", "Literally KEKWing and PogChamping", "Imagine a place- nah scratch that", "Glitch", "Talent not included!", "Please let me out I've been writing these titles for so long at least let me call my son he has special needs I bet he's scared right now please."];
	const TITLE = TITLE_OPTIONS[Math.floor(Math.random()*TITLE_OPTIONS.length)];
	onMount(async ()=>{
		document.getElementById("login").onclick = e => {
			window.document.cookie = `sid=${window.document.getElementById("sid").value};`
		}
	})
</script>

<svelte:head>
	<title> {TITLE} </title>
</svelte:head>

<section>
	<h1>Goto /@uname/replname</h1>
  <input type="text" id="sid" name="sid">
	<button id="login"> Set user sid </button>
</section>

<style lang="scss">
	@import '../../node_modules/xterm/css/xterm.css';
</style>
