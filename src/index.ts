
import { DoJson } from './DO/DoJson'
import { serveHtml } from './handlers/htmlHandler';
export { DoJson };

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname.endsWith('.html')) {
            return serveHtml(url.pathname);
        }
		
		if (url.pathname.startsWith('/api') || url.pathname.startsWith('/ws')) {
			let id = env.DO_JSON.idFromName("Server")
			let obj = env.DO_JSON.get(id)
			return obj.fetch(request);
		}

		return new Response(`Durable Object Server`, { headers: { 'Content-Type': 'text/html' }});
	},
} satisfies ExportedHandler<Env>;
