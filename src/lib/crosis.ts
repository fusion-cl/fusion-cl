export interface GovalMetadataResponse {
	result?: GovalMetadata;
	error: boolean;
	errorMessage?: string;
}

export interface GovalMetadata {
	token: string;
	gurl: string;
	conmanURL: string;
}

export interface ReplIDResult {
	id?: string;
	error: boolean;
	errorMessage?: string;
}

export async function fetchToken(
	replId: string,
	sid: string,
	captchaKey?: string
): Promise<GovalMetadataResponse> {
	const body = {
		clientVersion: '7561851',
		format: 'pbuf'
	};
	if (captchaKey) {
		body['captcha'] = captchaKey;
		body['hCaptchaSiteKey'] = '473079ba-e99f-4e25-a635-e9b661c7dd3e';
	}
	const r = await fetch(`https://replit.com/data/repls/${replId}/get_connection_metadata`, {
		headers: {
			'Content-Type': 'application/json',
			'X-Requested-With': 'Replinish (replit/@replinish)',
			cookie: `connect.sid=${sid}`,
			origin: 'https://replit.com',
			'User-Agent': 'Replinish (replit/@replinish)'
		},
		method: 'POST',
		body: JSON.stringify(body)
	});
	const replToken: {
		token?: string;
		gurl?: string;
		conmanURL?: string;
		message?: string;
	} = await r.json();
	if (!replToken.token) {
		if (replToken.message && replToken.message.toLowerCase().indexOf('captcha failed') !== -1) {
			return { error: true, errorMessage: 'captcha' };
		} else if (replToken.message && replToken.message.toLowerCase() == 'repl not found') {
			return { error: true, errorMessage: 'not_found' };
		}
		return { error: true, errorMessage: replToken.message };
	}
	return { result: <GovalMetadata>replToken, error: false };
}

export async function getReplID(repl: string, sid: string): Promise<ReplIDResult> {
	const res = await fetch(`https://replit.com/data/repls/${repl}`, {
		headers: {
			'X-Requested-With': 'Replinish (replit/@replinish)',
			cookie: `connect.sid=${sid}`,
			origin: 'https://replit.com',
			'User-Agent': 'Replinish (replit/@replinish)'
		},
		method: 'GET'
	});
	if (res.status == 404) {
		return { errorMessage: 'not_found', error: true };
	}
	const info: { id: string } = await res.json();
	return { id: info.id, error: false };
}
