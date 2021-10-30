const meta = {
  id: {
    type: 'string',
  },
  title: {
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
}

export const postSchema = {
  title: 'post',
  description: 'an individual note',
  version: 0,
  type: 'object',
  indexes: [
    'createdAt',
    'updatedAt'
  ],
  primaryKey: 'id',
  properties: {
    ...meta
  },
  required: ['title'],
};

export const imageSchema = {
  title: 'image',
  description: 'an individual note',
  version: 1,
  type: 'object',
  indexes: [
    'createdAt',
    'updatedAt'
  ],
  primaryKey: 'id',
  properties: {
    ...meta,
    'url': {
      "type": "string",
      "format": "uri",
      "component": "ImageInput"
    }
  },
  required: ['title'],
}

export const schemas = {
  posts: postSchema,
  images: imageSchema
} 