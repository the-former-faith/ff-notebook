<script>
  import { mainService } from '$lib/scripts/mainMachine'
</script>

<button on:click={ ()=> mainService.send({ type: 'CREATE' }) }>New Doc</button>