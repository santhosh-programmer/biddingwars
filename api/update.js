const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let productDetails = client.db('BiddingWars').collection('productDetails')
let userBid =  client.db('BiddingWars').collection('userBid')

router.get('/api/update', async (req, res) => {
    let productId = req.query.id
    let newPrice = parseInt(req.query.price)
    let userName = req.cookies.userName
    let product =  await productDetails.findOne({ productID:productId } , {currentPrice : 1})
    if(parseInt(product.currentPrice) < newPrice) {
        await productDetails.updateOne({productID : productId} , { $set : {currentPrice : newPrice}})
        await productDetails.updateOne( { productID : productId} , { $set : { maxBidUserName : userName }} )
    }
    if( await userBid.findOne({userName : userName, productID: productId })) {
        await userBid.updateOne({userName : userName, productID: productId} ,{ $set : {bestPrice : newPrice}})
    }
    else {
        await userBid.insertOne({
            userName: userName,
            productID: productId,
            bestPrice: newPrice
        })
    }
    res.json(newPrice)
})

module.exports = router