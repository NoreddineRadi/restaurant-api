const request = require('supertest')
const app = require('../app')
jest.mock('axios', () => {
  return {
    get: ()=> {return {data: {results: [{
      "name": "Maison des Sciences",
      "vicinity": "Place des Wallons 70, Ottignies-Louvain-la-Neuve",
      "rating": 4.4,
      "price_level": 1
    },
    {
      "name": "Mex&Go LLN",
      "vicinity": "Rue du Sablon 52, Ottignies-Louvain-la-Neuve",
      "rating": 4.3,
      "price_level": 1
    }]}
    }} 
  }
})


describe('/restaurants API', () => {
  it('should get No authorization token was found with status 401', async () => {
    const res = await request(app)
      .get('/restaurants')
    expect(res.statusCode).toEqual(401)
  })
  it('should get bad request `location and radius is required` ', async () => {
    const res = await request(app)
      .get('/restaurants')
      .set({Authorization: `Bearer ${process.env.TOKEN_MOCK}`})
      const {success, message, data} = JSON.parse(res.text)
    expect(res.statusCode).toEqual(400)
    expect(success).toEqual(false)
    expect(data.length).toEqual(0)
    expect(message).toEqual('the params `latitude, longitude and radius` is required and it should be a number')
  })
  it('should get bad request `range price is not valid` ', async () => {
    const res = await request(app)
      .get('/restaurants')
      .query({latitude: 50.670139, longitude:4.615537, radius:1000, rangePrice: 5})
      .set({Authorization: `Bearer ${process.env.TOKEN_MOCK}`})
      const {success, message, data} = JSON.parse(res.text)
    expect(res.statusCode).toEqual(400)
    expect(success).toEqual(false)
    expect(data.length).toEqual(0)
    expect(message).toEqual('the range price it is a number and it should be 0,1,2,3 or 4')
  })
  it('should get some results` ', async () => {
    const res = await request(app)
      .get('/restaurants')
      .query({latitude: 50.670139, longitude:4.615537, radius:1000, rangePrice: 2})
      .set({Authorization: `Bearer ${process.env.TOKEN_MOCK}`})
      const {success, message, data} = JSON.parse(res.text)
    expect(res.statusCode).toEqual(200)
    expect(success).toEqual(true)
    expect(data.length).toEqual(2)
    expect(message).toEqual('')
  })
})