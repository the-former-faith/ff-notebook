<script>
    import { db, currentDoc, name, body } from '$lib/stores'
    import { v1 as uuidv1 } from 'uuid'

    const createDoc = async () => {
      const blankDoc = {
        guid: uuidv1(),
        name: '',
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      }
      const db$ = await db()
      const newDoc = await db$.notes.insert(blankDoc)
      currentDoc.set(newDoc)
      name.set('')
      body.set({})
    }
</script>

<button on:click={()=> createDoc()}>Create New Doc</button>