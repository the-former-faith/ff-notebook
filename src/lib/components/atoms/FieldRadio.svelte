<script>
  export let key
  let options
  export { options as enum }
  console.log(options)
</script>

<fieldset>
  <legend>{key}</legend>

  {#each options as option}
    <input type="radio" id={option} name={key}>
    <label for={option}>{option}</label><br/>
  {/each}
</fieldset>
