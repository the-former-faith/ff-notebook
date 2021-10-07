<script>
  import { mainService } from '$lib/scripts/mainMachine'

  export let id
  export let doc
</script>

<a 
  href={id} 
  on:mouseover={() => mainService.send('NEW_EDITOR.ADD', {doc: doc, id: id})}
  on:focus={() => mainService.send('NEW_EDITOR.ADD', {doc: doc, id: id})}
>{doc.title}</a>