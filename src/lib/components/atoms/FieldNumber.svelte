<script>
  export let key
  export let descriptionKey
  export let required = false
  export let minimum = undefined
  export let maximum = undefined
  export let multipleOf = undefined
</script>
  
<input 
  type="number" 
  id={key} 
  name={key} 
  required={required} 
  min={minimum}
  max={maximum}
  aria-describedby={descriptionKey}
  step={multipleOf}
>