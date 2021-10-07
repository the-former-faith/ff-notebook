import netlify from '@sveltejs/adapter-netlify'

const config = {
	kit: {
		adapter: netlify(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		files: {
			serviceWorker: 'src/service-worker',
		},
		vite: {
			optimizeDeps: {
				exclude: ['y-websocket']
			}
		}
	},
};

export default config;
