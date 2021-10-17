<script>
  import {mainService} from '$lib/scripts/mainMachine'
</script>

<button 
  on:click={ ()=> mainService.send({ type: 'CREATE_DOC', collection: 'posts'}) }
  disabled={!$mainService.can('CREATE_DOC')}
>New Doc</button>
<!--<button 
  on:click={ ()=> mainService.send({ type: 'CREATE_DOC', collection: 'posts'}) }
>New Doc</button>-->

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