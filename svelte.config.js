import vercel from '@sveltejs/adapter-vercel'

const config = {
	kit: {
		adapter: vercel(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		files: {
			serviceWorker: 'src/service-worker',
		},
		vite: {
			ssr: {
				noExternal: ['pouchdb-browser', 'pouchdb-utils'],
        external: ['rxdb', 'uuid', 'rxjs']
			},
			define: {
				'process.env': {}
			}
    }
	},
};

export default config;
