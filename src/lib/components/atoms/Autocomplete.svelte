<script>
  import Field from '$lib/components/atoms/Field.svelte'
  import AutocompleteItems from '$lib/components/atoms/AutocompleteItems.svelte'
  import { mainService } from '$lib/scripts/mainMachine'
  import { useSelector } from '@xstate/svelte'
  export let key
  export let required = false
  export let description
  export let data
  export let changeHandler
  export let path
  export let options
  let value 
  $: value = data[key] ? data[key] : ''

  let collections

  $: if($mainService?.context.rxdb) {
    collections = useSelector($mainService.context.rxdb, (state) => state.context.collections)
  }

</script>

<Field 
  {key} 
  {description} 
  {required}
  {data}
  {path}
  let:descriptionKey
  let:value
>
  <select 
    id={key} 
    name={key} 
    required={required} 
    aria-describedby={descriptionKey}
    value={value ? value : ''}
    on:input={(e)=> changeHandler(e.target.value, path)}
  >
    <option value="">--Please choose an option--</option>
    {#if $collections}
      {#each Object.entries($collections) as [title, collection] }
        {#if options.datasets.includes(title)}
          <AutocompleteItems {collection} />
        {/if}
      {/each}
    {/if}
  </select>
</Field>