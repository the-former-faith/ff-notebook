<script>
  import {mainService} from '$lib/scripts/mainMachine'
  export let collection

  const singular = collection.replace(/s$/, '')
</script>

<button 
  on:click={ ()=> mainService.send({ type: 'CREATE_DOC', collection: collection}) }
  disabled={!$mainService.can('CREATE_DOC')}
>New {singular}</button>

<style>
  button {
    background-color: var(--action-color);
    color: var(--background-color);
    font-weight: 700;
    position: absolute;
    top: 0;
    right: 0;
    width: auto;
  }

  [disabled] {
    opacity: 0.2;
  }
</style>