import adapter from '@sveltejs/adapter-netlify'

const config = {
	kit: {
		adapter: adapter(),
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
}

export default config
