<script>
    import { db, currentDoc, name, body } from '$lib/stores'
    import * as Y from 'yjs'

    const createDoc = async () => {
      let ydoc = new Y.Doc()
      console.log(ydoc)
      const db$ = await db()
      await db$.notes
        .insert({
          guid: ydoc.guid,
          name: $name,
          body: $body,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        })
        //.then(resetForm)
    }
</script>

<button on:click={()=> createDoc()}>Create New Doc</button>