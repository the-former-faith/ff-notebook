<script>
  export let key
  export let required = false
  export let minLength = undefined
  export let maxLength = undefined
  export let format
  export let descriptionKey
  export let data
  export let changeHandler
  let value 
  $: value = data[key] ? data[key] : ''

  //TODO: Check to make sure 'format' is a valid input type

</script>

<input 
  type={format ? format : 'text'}
  id={key} 
  name={key} 
  required={required} 
  minlength={minLength}
  maxlength={maxLength}
  aria-describedby={descriptionKey}
  {value}
  on:input={changeHandler}
>
