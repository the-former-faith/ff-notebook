<script>
  export let key
  export let required = false
  export let minLength = undefined
  export let maxLength = undefined
  export let format
  export let descriptionKey
  export let data
  let value = data[key] ? data[key] : ''

  $: if (value) {
    let patch = {}
    patch[key] = value
    data.atomicPatch(patch)
  }
</script>

<input 
  type='text'
  id={key} 
  name={key} 
  required={required} 
  minlength={minLength}
  maxlength={maxLength}
  aria-describedby={descriptionKey}
  bind:value={value}
>
