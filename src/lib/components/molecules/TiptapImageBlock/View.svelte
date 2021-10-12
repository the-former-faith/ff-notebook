<script>
  import { NodeViewWrapper, editable } from 'svelte-tiptap'
  //import { NodeViewProps } from '@tiptap/core'

  export let selected = false
  export let node

  console.log(node)
</script>

<NodeViewWrapper class="svelte-component { selected }" >
  <span class="label">Svelte Editable Component</span>

  <!-- Content is inserted here -->
  <p use:editable class="content editable">content</p>
</NodeViewWrapper>