/* eslint-disable global-require */
module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Restaurant API',
    description: 'Obtain restaurant suggestions for a given location and some other parameters',
    license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
  },
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    ...require('./restaurantDocs.js'),
  },
  definitions: {
    response: {
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'array',
          items: { type: 'object' },
          default: [],
        },
      },
    },
  },
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  security: [
    {
      jwt: []
    }
  ]
}
