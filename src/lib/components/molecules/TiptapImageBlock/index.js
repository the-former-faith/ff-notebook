import { Node, mergeAttributes } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'svelte-tiptap'
import View from './View.svelte'

const ImageBlock = Node.create({
  name: 'imageBlock',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'image-block' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['image-block', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return SvelteNodeViewRenderer(View)
  },
})

export default ImageBlock