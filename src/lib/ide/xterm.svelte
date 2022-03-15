<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<script>
	export let type;
	export let crosis;
	export let term;
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	console.log(type)
	
	const { username, replname } = $page.params;
	
	onMount(async () => {
		switch (type) { 
			case "console": {
				crosis.openChannel(
					{ service: 'shellrun2', action: 2, name: "shellrunner" },
					function open({ channel, context }) {
						if (!channel) {
							return;
						}
						
						term.write("\x1b[H\x1b[2J\x1b[3J")
		
						channel.send({
							runMain: {}
						})
		
						channel.onCommand((cmd) => {
							if (cmd.output) {
								term.write(cmd.output.replaceAll("", "⠕"));
							}
						});
		
						term.onKey((key, ev) => {
							channel.send({
								input: key.key
							});
						});
		
						return function cleanup({ willReconnect }) {};
					}
				
				);
			}
			case "shell": {
				crosis.openChannel(
					{ service: "shell" },
					function open({ channel, context }) {
						if (!channel) {
							return;
						}

						term.write("\x1b[H\x1b[2J\x1b[3J")

						channel.onCommand((cmd) => {
							if (cmd.output) {
								term.write(cmd.output);
							}
						});

						// used to be onKey
						/*term.onKey((key, ev) => {
							channel.send({
								input: key.key
							});
						});*/
						term.onData((key, _) => {
							channel.send({
								input: key
							});
						});
		
						return function cleanup({ willReconnect }) {};
					}
				
				);
				break
			}
			default: {
				term.write(`Unknown terminal type: ${type}`)
			}
		}
		
	});
</script>

<style lang="scss">
	@import '../../../node_modules/xterm/css/xterm.css';
</style>
