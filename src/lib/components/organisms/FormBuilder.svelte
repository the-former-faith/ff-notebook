<script>
  import string from "$lib/components/atoms/FieldString.svelte"
  import number from "$lib/components/atoms/FieldNumber.svelte"
  import fieldset from "$lib/components/atoms/FieldSet.svelte"
  import radio from "$lib/components/atoms/FieldRadio.svelte"
  export let customFields = {}
  export let schema
  export let data
  export let changeHandler
  export let path

  const fields = {
    string: string,
    number: number,
    object: fieldset,
    radio: radio,
    ...customFields
  }
</script>

{#each Object.entries(schema) as [key, field] }
  {#if field.display !== 'private'}
    {#if fields[field.component] || fields[field.type]}
      <svelte:component
        this={field.component ? fields[field.component] : fields[field.type]} 
        {key} 
        required={schema.required ? schema.required.includes(key) : false} 
        {...field}
        {data}
        {changeHandler}
        path={ path ? [...path, key] : [key] }
      />
    {/if}
  {/if}
{/each}