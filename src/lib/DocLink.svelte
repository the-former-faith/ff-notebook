<script>
  import { mainService } from '$lib/scripts/service'

  export let doc
</script>

<a 
  href={doc.id} 
  on:mouseover={() => mainService.send('NEW_EDITOR.ADD', doc)}
  on:focus={() => mainService.send('NEW_EDITOR.ADD', doc)}
>{doc.name}</a>