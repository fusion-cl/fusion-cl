import type { RequestHandler } from '@sveltejs/kit';

import { getReplID } from '$lib/crosis';
import { parse } from 'cookie';

export const get: RequestHandler = async (req) => {
	const replName = req.params.repl;
	const userName = req.params.username;
	const replID = req.params.repl_id;
	const cookies = parse(req.request.headers.get('cookie'))
	
	const fetchedId = await getReplID(`@${userName}/${replName}`, cookies["sid"]);
	return {
		status: 200,
		body: fetchedId
	} as any;
};
