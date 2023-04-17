const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let productDetails = client.db('BiddingWars').collection('productDetails')

router.get('/api/results', async (req,res) => {
    let query = req.query.id.toString()
    let results = await productDetails.find( {  $and: [{ productName : { $regex : query , $options: 'i'}}, { status : { $ne : 'ended' } }   ] } , {projection : { productName : 1 , productID : 1}} ).limit(6).toArray()
    res.send(results)
})
 
module.exports = router