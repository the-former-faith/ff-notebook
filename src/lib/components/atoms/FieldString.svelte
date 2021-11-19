<script>
  import Field from '$lib/components/atoms/Field.svelte'
  export let key
  export let required = false
  export let minLength = undefined
  export let maxLength = undefined
  export let format
  export let description
  export let data
  export let changeHandler
  export let path
  let value 
  $: value = data[key] ? data[key] : ''

  //TODO: Check to make sure 'format' is a valid input type

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
  <input 
    type={format ? format : 'text'}
    id={key} 
    name={key} 
    required={required} 
    minlength={minLength}
    maxlength={maxLength}
    aria-describedby={descriptionKey}
    value={value ? value : ''}
    on:input={(e)=> changeHandler(e.target.value, path)}
  >
</Field>