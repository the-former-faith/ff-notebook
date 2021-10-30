<script>
  export let key
  export let description
  export let required
  export let descriptionKey = description ? `${key}-description` : undefined
</script>

<label for={key}>{key}{#if required}*{/if}</label>

{#if description}
  <p id={descriptionKey}>{description}</p>
  <!--@TODO - add requirements in a details/summary block. 
      Can be automatically generated based on input requirements. 
      i.e. "Number must be greater than 1 and less than 100"-->
{/if}

<slot {descriptionKey}></slot>