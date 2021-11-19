<script>
  import FormBuilder from '$lib/components/organisms/FormBuilder.svelte'
  export let properties
  export let changeHandler
  export let data
  export let title
  export let path
</script>

<fieldset name={title}>
  <legend>{title}</legend>
  <FormBuilder 
    schema={properties}
    data={data}
    {changeHandler}
    {path}
  />
</fieldset>

<style>
  fieldset {
    display: grid;
    gap: 1rem;
  }
</style>