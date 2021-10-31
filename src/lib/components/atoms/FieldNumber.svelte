<script>
  export let data
  export let key
  export let descriptionKey
  export let required = false
  export let minimum = undefined
  export let maximum = undefined
  export let multipleOf = undefined

  const handleInput = e => {
    let patch = { updatedAt: new Date().getTime() }
    patch[key] = e.target.value
    data.atomicPatch(patch)
  }
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
  value={data[key]}
  on:input={(e) => handleInput(e)}
>