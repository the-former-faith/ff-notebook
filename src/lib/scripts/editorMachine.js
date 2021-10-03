import { createMachine } from 'xstate'

const editorMachine = (doc) => {
  return createMachine({
    id: 'editor machine',
    context: {
      doc: doc
    },
    type: 'parallel',
    states: {
      editor: {
        initial: 'initiatingRxDB',
        states: {
          initiatingRxDB: {},
        },
        after: {
          500: { 
            actions: (context, event) => console.log(context)
          }
        }

      },
      userInput: {
        initial: 'idle',
        states: {
          idle: {}
        }
      }
    }
  })
}

export default editorMachine