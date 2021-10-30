<script>
  //@TODO - change to be a component: https://github.com/sveltejs/component-template
  import string from "$lib/components/atoms/FieldString.svelte"
  import number from "$lib/components/atoms/FieldNumber.svelte"
  import Field from '$lib/components/atoms/Field.svelte'
  export let customFields = {}
  export let schema
  export let data

  const fields = {
    string: string,
    number: number,
    ...customFields
  }
</script>

<div>
	<form>
    {#each Object.entries(schema.properties) as [key, field] }
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
        />
      </Field>
    {/each}
    <!--<input type="submit" value="submit" />-->
  </form>
</div>