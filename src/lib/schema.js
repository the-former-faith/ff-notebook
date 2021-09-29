const noteSchema = {
    title: 'note',
    description: 'an individual note',
    version: 0,
    type: 'object',
    indexes: [
      'createdAt',
      'updatedAt'
    ],
    primaryKey: 'guid',
    properties: {
      guid: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      body: {
        type: 'array',
        items: [
          {
            type: 'object',
            properties: {
              type: {
                type: 'string'
              },
              content: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string'
                    },
                    marks: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          type: {
                            type: 'string'
                          }
                        },
                      }
                    },
                    text: {
                      type: 'string'
                    }
                  },
                }
              }
            }
          }
        ]
      },
      createdAt: {
        type: 'number',
      },
      updatedAt: {
        type: 'number',
      },
    },
    required: ['name'],
  };
  
  export default noteSchema;