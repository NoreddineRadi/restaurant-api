const express = require('express');
const router = express.Router();
const axios = require('axios')
const jwt = require('jsonwebtoken')
const secret = Buffer.from(process.env.JWT_SUPER_SECRET, 'base64')
const token = jwt.sign({name: 'rano', id: '10000'}, secret, {
  expiresIn: '24h',
})
console.log(token)
router.get('/', async function(req, res, next) {
  const {latitude, longitude, radius, rangePrice, attendees} = req.query
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
  const location =`location=${latitude},${longitude}`
  const perimeter= `radius=${radius}`
  const API_KEY = process.env.GOOGLE_API_KEY
  const maxPrice = `${rangePrice ? `&maxprice=${rangePrice}` : ''}`
  const keywords = `${attendees ? `&keyword=${attendees}`: ''}`
  const fields= 'fields=formatted_address,name'
  if (!latitude || !longitude || !radius || isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
    res.status(400).send({
      success: false,
      message: 'The params `latitude, longitude and radius` is required and it should be a number',
      data: []
    })
  } else if ((rangePrice && isNaN(rangePrice) ) || (rangePrice < 0 || rangePrice > 4)) {
    res.status(400).send({
      success: false,
      message: 'Range price is a number and it should be 0,1,2,3 or 4',
      data: []
    })
  } else {
    try {
      const { data } = await axios.get(`${baseUrl}${location}&${perimeter}&type=restaurant${keywords}${maxPrice}&${fields}&key=${API_KEY}`)
      const result = data.results
      .map(({name, vicinity, rating, price_level}) => ({name, vicinity, rating, price_level}))
      .sort((a,b)=>  b.rating - a.rating )
      res.status(200).send({
        success: true,
        message: '',
        data: result
      })
    }catch(e) {
      res.status(500).send(e)
      console.log('error', e);
    }
  }
});

module.exports = router;
