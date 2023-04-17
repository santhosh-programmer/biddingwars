const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let userBid =  client.db('BiddingWars').collection('userBid')
router.get('/api/getBestPrice' , async (req,res) => {
    let bid = await userBid.findOne({productID: req.query.id , userName: req.cookies.userName }, {bestPrice : 1})
    if(bid) {
        res.json(bid.bestPrice)
    }
    else {
        res.json(0)
    }
})

module.exports = router