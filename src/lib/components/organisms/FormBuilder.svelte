<script>
  import string from "$lib/components/atoms/FieldString.svelte"
  import number from "$lib/components/atoms/FieldNumber.svelte"
  import Field from '$lib/components/atoms/Field.svelte'
  export let customFields = {}
  export let schema
  export let data
  export let changeHandler

  const fields = {
    string: string,
    number: number,
    ...customFields
  }

  //@TODO: pull actual onchange handlers out of inputs and pass as a prop.
  //This way the top-level form can save to RxDB,
  //And the modals can save to Tiptap.
</script>

<div>
	<form>
    {#each Object.entries(schema.properties) as [key, field] }
      {#if field.display !== 'private'}
        {#if fields[field.component] || fields[field.type]}
          <Field 
            {key} 
            description={field.description} 
            required={schema.required ? schema.required.includes(key) : false} 
            let:descriptionKey={descriptionKey}
          >
            <svelte:component
              this={field.component ? fields[field.component] : fields[field.type]} 
              {key} 
              required={schema.required ? schema.required.includes(key) : false} 
              {...field}
              descriptionKey={descriptionKey}
              {data}
              {changeHandler}
            />
          </Field>
        {/if}
      {/if}
    {/each}
    <!--<input type="submit" value="submit" />-->
  </form>
</div>

<style>
  form {
    display: grid;
    gap: 1rem;
  }
</style>