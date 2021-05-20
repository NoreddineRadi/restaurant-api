module.exports = {
	'/restaurants': {
		get: {
			tags: ['Restaurants'],
			summary: 'Get restaurants',
			parameters: [
				{ name: 'latitude', in: 'query', type: 'number', format: 'float', /* required: true, */ default: 50.670139},
				{ name: 'longitude', in: 'query', type: 'number',  format: 'float', /* required: true, */ default: 4.615537 },
				{ name: 'radius', in: 'query', type: 'number', description: 'the searching radius in (m)', default: 1000 },
				{ name: 'rangePrice', in: 'query', type: 'number', enum: [0,1,2,3,4,], description: 'Max: 0, 1, 2, 3 or 4',  },
			  { name: 'attendees', in: 'query', type: 'array', items: {type: 'string', default: ''}, minItems:1},
			],
			responses: {
				200: {
					description: 'OK',
					schema: { $ref: '#/definitions/response' },
				},
			},
		},
	},
}
