import type { RequestHandler } from '@sveltejs/kit';

import { fetchToken } from '$lib/crosis';
import { parse } from 'cookie';

export const get: RequestHandler = async (req) => {
	const replID = req.params.repl_id;
	const cookies = parse(req.request.headers.get('cookie'));
	const captcha = req.request.headers.get('X-Captcha-Key')
	return {
		status: 200,
		body: await fetchToken(replID, cookies['sid'], captcha)
	} as any;
};
