<script>
  import lensPath from 'ramda/src/lensPath'
  import set from 'ramda/src/set'
  import Tiptap from '$lib/components/organisms/Tiptap.svelte'
  import { currentDoc } from '$lib/scripts/stores'
  import { mainService } from '$lib/scripts/mainMachine'
  import { useSelector } from '@xstate/svelte'
  import ImageInput from '$lib/components/molecules/ImageInput.svelte'
  import FormBuilder from '$lib/components/organisms/FormBuilder.svelte'
  import ArticleParser from '$lib/components/molecules/ArticleParser.svelte'
  import { schemas } from '$lib/schema'

  let collections
  export let id
  export let collection

  $: if($mainService?.context.rxdb) {

    collections = useSelector($mainService.context.rxdb, (state) => state.context.db)
    
    //@TODO: find a way so this crummy code can be cleaned up
    if(!$currentDoc && $collections && $collections[collection]) {
      $collections[collection].findOne(id)
        .exec()
        .then(doc => $currentDoc = doc)
    }
  }

  const updateRxDB = (oldData, value, path) => {
    const lens = lensPath(path)
    oldData.updatedAt = new Date().getTime()
    const newData = set(lens, value, oldData)
    return newData
  }

  const handleInput = (value, path, data) => {
    data.atomicUpdate((x) => updateRxDB(x, value, path))
  }
</script>

<ArticleParser />

<div class="editor">
  {#if $currentDoc}
    <FormBuilder 
      schema={schemas[collection].schema.properties}
      customFields={{ImageInput: ImageInput, TipTap: Tiptap}}
      data={$currentDoc}
      changeHandler={(value, path) => handleInput(value, path, $currentDoc)}
    />
  {/if}
</div>

<style>
  .editor {
    display: grid;
    grid-template-columns: 0 1fr 0;
    grid-auto-rows: max-content;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    flex: 1;
  }

  .editor > :global(*){
    grid-column: 2;
  }
</style>
