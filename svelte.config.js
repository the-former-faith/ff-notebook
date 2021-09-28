import netlify from '@sveltejs/adapter-netlify'

const config = {
	kit: {
		adapter: netlify(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			ssr: {
				noExternal: ['pouchdb-browser', 'pouchdb-utils']
			},
			define: {
				'process.env': {}
			}
        }
	}
};

export default config;
