<script>
  import { NodeViewWrapper, editable } from 'svelte-tiptap'

  export let selected = false
  export let node

  console.log(node)
</script>

<NodeViewWrapper class="svelte-component" >
  <span class="label">Svelte Editable Component</span>

  <!-- Content is inserted here -->
  <p use:editable class="content editable" />
</NodeViewWrapper>

<style>
  :global(.svelte-component) {
    background-color: lightgoldenrodyellow;
    padding: 1rem;
  }
</style>