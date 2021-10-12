import { Mark, mergeAttributes } from '@tiptap/core'

const Lang = Mark.create({
  name: 'lang',

  defaultOptions: {
    HTMLAttributes: {
      lang: 'en'
    },
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setLang: () => ({ commands }) => {
        return commands.setMark('lang')
      },
      toggleLang: () => ({ commands }) => {
        return commands.toggleMark('lang')
      },
      unsetLang: () => ({ commands }) => {
        return commands.unsetMark('lang')
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-,': () => this.editor.commands.toggleLang(),
    }
  },
})

export default Lang