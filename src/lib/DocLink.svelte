<script>
  import { mainService } from '$lib/scripts/service'

  export let doc
</script>

<a 
  href={doc.id} 
  on:mouseover={() => mainService.send('NEW_EDITOR.ADD', {doc: doc, id: doc.id})}
  on:focus={() => mainService.send('NEW_EDITOR.ADD', {doc: doc, id: doc.id})}
>{doc.name}</a>