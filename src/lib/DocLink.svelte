<script>
  import { allDocsOpened } from '$lib/scripts/stores'
  export let id
  export let doc
  export let current
  const updated = new Date(doc.updatedAt);
</script>
<a 
  href={id}
  on:click={()=> {
    $allDocsOpened = false
  }}

aria-current={current}
><span>{doc.title ? doc.title : 'Untitled'}</span> <small>{updated.toLocaleDateString()}</small></a>

<style>
  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    color: var(--text-color);
    padding: 0.5rem;
    min-height: 44px;
  }

  a[aria-current='true'] {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>