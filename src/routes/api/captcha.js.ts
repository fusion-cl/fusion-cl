import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (req) => {
	let res = await fetch("https://js.hcaptcha.com/1/api.js?onload=renderCaptcha&render=explicit")

	return {
		status: res.status,
		body: await res.text(),
		headers: {
			"Content-Type": "text/javascript"
		}
	} as any;
};
