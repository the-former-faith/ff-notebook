import adapter from '@sveltejs/adapter-netlify'

const config = {
	kit: {
		adapter: adapter(),
		target: '#svelte',
    vite: {
			ssr: {
				noExternal: ['pouchdb-browser', 'pouchdb-utils'] //For RxDB
			},
			define: {
				'process.env': {} //For RxDB
			}
    }
	}
}

export default config
