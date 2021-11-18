/* Marks */

const link = {
  title: 'link',
  type: 'object',
  properties: {
    type: {
      "type": "string",
      "enum": ["link"]
    },
    attrs: {
      type: 'object',
      properties: {
        href: {
          type: 'string',
          format: 'uri'
        },
        target: {
          "type": "string",
          "enum": ["", "_self", "_blank", "_parent", "_top"],
          "component": "radio"
        }
      }
    }
  }
}

const bold = {
  title: 'bold',
  type: 'object',
  properties: {
    type: {
      "type": "string",
      "enum": ["bold"]
    }
  }
}

/* Objects */
const date = {
  title: 'date',
  type: 'object',
  properties: {
    date: {
      "type": "number",
    },
    test: {
      type: 'string'
    }
  }
}

const meta = {
  id: {
    type: 'string',
    display: 'private'
  },
  title: {
    type: 'string',
  },
  date,
  body: {
    type: 'array',
    component: 'TipTap',
    // items: [
    //   {
    //     type: 'object',
    //     title: 'paragraph',
    //     properties: {
    //       type: {
    //         type: 'string'
    //       },
    //       content: {
    //         type: 'array',
    //         items: {
    //           type: 'object',
    //           properties: {
    //             type: {
    //               type: 'string'
    //             },
    //             marks: {
    //               type: 'array',
    //               items: [link, bold]
    //             },
    //             text: {
    //               type: 'string'
    //             }
    //           },
    //         }
    //       }
    //     }
    //   }
    // ]
  },
  createdAt: {
    type: 'number',
    display: 'private'
  },
  updatedAt: {
    type: 'number',
    display: 'private'
  },
}

export const postSchema = {
  schema: {
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
  }
}

export const imageSchema = {
  schema: {
    title: 'image',
    description: 'an individual note',
    version: 0,
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
}

export const schemas = {
  posts: postSchema,
  images: imageSchema
} 