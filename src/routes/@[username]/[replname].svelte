<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<script lang="ts">
	import XTerm from "$lib/ide/xterm.svelte";
	
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	
	const { username, replname } = $page.params;

	enum FetchConnectionMetadataError {
		/**
		 * Fetch was aborted.
		 */
		Aborted = 'Aborted',

		/**
		 * The fetch failed due to a recoverable error (mostly a transient network
		 * condition).
		 */
		Retriable = 'Retriable'
	}

	interface GovalMetadata {
		token: string;
		gurl: string;
		conmanURL: string;
	}

	/**
	 * A type that helps signal whether an operation was successful or errored.
	 */
	type Result<Res, Err = Error> = (Res & { error: null }) | { error: Err };

	/** The result of `fetchConnectionMetadata` */
	type FetchConnectionMetadataResult = Result<GovalMetadata, Error | FetchConnectionMetadataError>;
	let xterm;
	let crosis;
	let hcaptcha;

	let xtermComponent;
	function renderCaptcha() {
		/*hcaptcha.render("cap", {
			sitekey: "473079ba-e99f-4e25-a635-e9b661c7dd3e"
		});*/
	}
	function onCaptchaSubmit(response) {
		//debugger;
		crosisConnect(response)
	}

	
	onMount(async () => {
		document.getElementById("console-check").onclick = event => {
			console.log(error)
			console.log(event.target.checked)
			//	return
			if(event.target.checked) {
				if (!error) {
					xtermComponent = {
						crosis: crosisClient,
						term: term,
						type: "console"
					}
				}
			} else {
				if (!error) {
					xtermComponent = {
						crosis: crosisClient,
						term: term,
						type: "shell"
					}
				}
			}
		}
		
		let error = "init state";
		window.onCaptchaSubmit = onCaptchaSubmit
		let xterm = await import('xterm');
		let crosis = await import('$lib/crosis/src/index');
		const Client = crosis.Client;

		class ModClient extends Client {
			
		}
		
		let fit = await import('xterm-addon-fit');
		let links = await import('xterm-addon-web-links');
		let unicode = await import('xterm-addon-unicode11');
		
		let term = new xterm.Terminal({fontFamily: "'IBM Plex Mono', monospace",theme: {"background": "#1d1f21", "foreground": "#c5c8c6", "black": "#1d1f21", "blue": "#3971ed", "brightBlack": "#969896", "brightBlue": "#6796ff", "brightCyan": "#8ae9fc", "brightGreen": "#44ff8c", "brightMagenta": "#cd7dff", "brightRed": "#ff4e43", "brightWhite": "#ffffff", "brightYellow": "#ffbe52", "cursor": "#C5C8C6", "cursorAccent": "#969896", "cyan": "#39cbed", "green": "#198844", "magenta": "#a36ac7", "red": "#cc342b", "selection": "#969896", "white": "#C5C8C6", "yellow": "#fba922"}, screenReaderMode: true});
		
		const fitAddon = new fit.FitAddon();
		const linkAddon = new links.WebLinksAddon();
		const unicode11Addon = new unicode.Unicode11Addon();
		
		term.loadAddon(fitAddon);
		term.loadAddon(linkAddon);
		term.loadAddon(unicode11Addon); // improved unicode support go brrrrrr

		// activate the new version
		term.unicode.activeVersion = '11';
		term.open(document.getElementById('terminal'));

		if (new URLSearchParams(window.location.search).has("webgl")) {
			console.debug("[webgl] enabled")
			let webgl = await import('xterm-addon-webgl');
			let webglAddon = new webgl.WebglAddon()

			webglAddon.onContextLoss(e => {
				webglAddon.dispose();
			});

			term.loadAddon(webglAddon);
		}
		if (new URLSearchParams(window.location.search).has("debug")) {
			/*term.onData((...args) => {
				console.debug(args)
			})*/
		}
		
		//term.write('Hello from \x1B[1;3;31mreplinish [BETA]\x1B[0m $ ');
		fitAddon.fit();
		window.addEventListener('resize', (_) => {
			fitAddon.fit();
		});
		async function getId(): Promise<string> {
			let replData = await (await fetch(`/api/get_id/@${username}/${replname}`)).json();
			return replData.id;
		}

		async function fetchConnectionMetadata(
			abortSignal: AbortSignal
		): Promise<FetchConnectionMetadataResult> {
			let captchaStuff = {}
			if (window.captchaKey) {
				captchaStuff['X-Captcha-Key'] = window.captchaKey
			}
			let res = await (await fetch(`/api/get_token/${await getId()}`, {
				headers: captchaStuff
			})).json();
			if (res.error) {
				term.write(`\x1b[H\x1b[2J\x1b[3JError: ${res.errorMessage}`);
				error = true;
				if(res.errorMessage == "captcha") {
					hcaptcha = await import('https://beplit.com/api/captcha.js');
					
				}
				//@ts-ignore
				return { error: res.errorMessage };
			}
			error = false;
			return res.result;
		}

		async function connect(captcha?: string) {
			term.write("\x1b[H\x1b[2J\x1b[3Jloading...")
			window.captchaKey = captcha
			const client = new ModClient();
			window.crosisClient = client
			
			client.open({ context: null, fetchConnectionMetadata }, function onOpen({ channel, context }) {
				if (!channel) {
					return;
				}

				console.log(error)
				if (!error) {
					xtermComponent = {
						crosis: client,
						term: term,
						type: "shell"
					}
				}
	
				return function cleanup({ willReconnect }) {};
			});
		}
		await connect()
		window.crosisConnect = connect
	});
</script>

<svelte:head>
	<title>{replname} - Fusion</title>
</svelte:head>

<section id="page">
	<span><p>Console:</p><input type="checkbox" id="console-check"></span>
	<div class="h-captcha" data-sitekey="473079ba-e99f-4e25-a635-e9b661c7dd3e" data-theme="dark" id="cap" data-callback="onCaptchaSubmit"></div>
	{#if xtermComponent}
			<XTerm type={xtermComponent.type} term={xtermComponent.term} crosis={xtermComponent.crosis}/>
	{/if}
	<div id="terminal" />
</section>

<style lang="scss">
	@import '../../../node_modules/xterm/css/xterm.css';
</style>