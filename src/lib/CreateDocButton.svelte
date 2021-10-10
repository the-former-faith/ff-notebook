<script>
  import { mainService } from '$lib/scripts/mainMachine'
</script>

<button on:click={ ()=> mainService.send({ type: 'CREATE' }) }>New Doc</button>

<style>
  button {
    background-color: var(--action-color);
    color: var(--background-color);
    font-weight: 700;
  }
</style>