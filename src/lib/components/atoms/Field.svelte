<script>
  import rPath from 'ramda/src/path'
  export let key
  export let description
  export let required
  export let data
  export let path
  let descriptionKey = description ? `${key}-description` : undefined
  let value = rPath(path, data)
</script>

<div>
  <label for={key}>{key}{#if required}*{/if}</label>

  {#if description}
    <p id={descriptionKey}>{description}</p>
    <!--@TODO - add requirements in a details/summary block. 
        Can be automatically generated based on input requirements. 
        i.e. "Number must be greater than 1 and less than 100"-->
  {/if}
  
  <slot {descriptionKey} {value}></slot>
</div>

<style>
  div {
    display: grid;
    gap: 0.25rem;
    grid-auto-rows: max-content;
  }
</style>