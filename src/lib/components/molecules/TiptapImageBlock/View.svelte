<script>
  import { NodeViewWrapper, editable } from 'svelte-tiptap'
</script>

<NodeViewWrapper class="svelte-component" >
  <span class="label">Svelte Editable Component</span>

  <!-- Content is inserted here -->
  <div use:editable class="content editable" />
</NodeViewWrapper>

<style>
  :global(.svelte-component) {
    background-color: lightgoldenrodyellow;
    padding: 1rem;
  }
</style>