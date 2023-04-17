const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let productDetails = client.db('BiddingWars').collection('productDetails')

router.get('/api/getCurrentPrice', async (req,res) => {
    let product = await productDetails.findOne({ productID: req.query.id } , {currentPrice : 1})
    res.json({currentPrice : product.currentPrice , status : product.status, isOwn: (product.sellerUserName == req.cookies.userName) ? 'yes' : 'no' })
})

module.exports = router