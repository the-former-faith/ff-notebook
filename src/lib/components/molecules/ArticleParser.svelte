<script>
  import { page } from '$app/stores'
  import { dev } from '$app/env'

  let protocol = dev ? 'http' : 'https'

  const parseUrl = async (url) => {
    let response = await fetch(`${protocol}://${$page.host}/parse-url?url=${url}`)

    if (response.ok) { // if HTTP-status is 200-299
      // get the response body (the method explained below)
      let json = await response.json()
      console.log(json)
    } else {
      alert("HTTP-Error: " + response.status)
    }
  }
</script>

<button on:click={()=> parseUrl('https://goo.gl/MV8Tkh')}>Parse URL</button>
