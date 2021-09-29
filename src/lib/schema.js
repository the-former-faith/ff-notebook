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
        type: 'string'
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