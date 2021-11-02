<script>
  export let key
  export let required = false
  export let minLength = undefined
  export let maxLength = undefined
  export let format
  export let descriptionKey
  export let data
  let value 
  $: value = data[key] ? data[key] : ''

  //TODO: Check to make sure 'format' is a valid input type

  const handleInput = e => {
    let patch = { updatedAt: new Date().getTime() }
    patch[key] = e.target.value
    data.atomicPatch(patch)
  }
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
  on:input={(e) => handleInput(e)}
>
