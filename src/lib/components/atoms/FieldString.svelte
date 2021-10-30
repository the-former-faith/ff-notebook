<script>
  import Field from '$lib/components/atoms/Field.svelte'

  export let key
  export let required = false
  export let minLength = undefined
  export let maxLength = undefined
  export let format
  export let descriptionKey
  export let data
</script>

<input 
  type={format ? format : 'text'}
  id={key} 
  name={key} 
  required={required} 
  minlength={minLength}
  maxlength={maxLength}
  aria-describedby={descriptionKey}
  value={data[key]}
>
