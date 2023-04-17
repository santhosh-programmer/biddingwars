const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let myFavourite = client.db('BiddingWars').collection('myFavourite')

router.get('/api/isFav', async (req,res) => {
    let product = await myFavourite.findOne({ productID: req.query.id , userName : req.cookies.userName } )
    if(product) {
        res.json(1)
    }
    else {
        res.json(0)
    }
})

module.exports = router