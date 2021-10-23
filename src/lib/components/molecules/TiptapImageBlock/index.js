import { Node, mergeAttributes } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'svelte-tiptap'
import View from './View.svelte'

const ImageBlock = Node.create({
  name: 'image-block',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    // Return an object with attribute configuration
    return {
      dog: {}
    }
  },

  parseHTML() {
    return [{ tag: 'image-block' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['image-block', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return SvelteNodeViewRenderer(View)
  },

  addCommands() {
    return {
      setImage: () => ({ commands }) => {
        return commands.setNode('image-block')
      },
    }
  },
})

export default ImageBlock