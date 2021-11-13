<script>
  import Tiptap from '$lib/components/organisms/Tiptap.svelte'
  import { currentDoc } from '$lib/scripts/stores'
  import { mainService } from '$lib/scripts/mainMachine'
  import { useSelector } from '@xstate/svelte'
  import ImageInput from '$lib/components/molecules/ImageInput.svelte'
  import FormBuilder from '$lib/components/organisms/FormBuilder.svelte'
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

  const handleInput = (e, data) => {
    let patch = { updatedAt: new Date().getTime() }
    patch[e.target.name] = e.target.value
    data.atomicPatch(patch)
  }
</script>

<div class="editor">
  {#if $currentDoc}
    <FormBuilder 
      schema={schemas[collection].schema}
      customFields={{ImageInput: ImageInput, TipTap: Tiptap}}
      data={$currentDoc}
      changeHandler={(e) => handleInput(e, $currentDoc)}
    />
  {/if}
</div>

<style>
  .editor {
    display: grid;
    grid-template-columns: 0 1fr 0;
    /*Will have to make the rows programatic when we use form builder*/
    grid-template-rows: repeat(2, max-content) 1fr;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    flex: 1;
  }

  .editor > :global(*){
    grid-column: 2;
  }
</style>
