<script>
  import get from 'lodash.get'
  let options
  export { options as enum }
  export let key
  export let changeHandler
  export let path
  export let required = false
  export let data
  let value = get(data, path.join('.'))
  console.log(value)
</script>

<fieldset>
  <legend>{key}</legend>

  {#each options as option}
    <input 
      type="radio" 
      id={option} 
      name={key}
      checked={value === option ? true : undefined}
      on:input={(e)=> changeHandler(option, path)}
    >
    <label for={option}>{option} - {value === key}</label><br/>
  {/each}
</fieldset>
