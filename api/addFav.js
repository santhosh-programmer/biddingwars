const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let myFavourite = client.db('BiddingWars').collection('myFavourite')

router.put('/api/addFav' , async (req,res) => {
    let productID = req.query.id
    let userName = req.cookies.userName
    if( await myFavourite.findOne({productID : productID , userName : userName})) {
        await myFavourite.deleteOne({userName: userName , productID : productID})
        res.json(0)
    }
    else {
        await myFavourite.insertOne({userName: userName , productID : productID})
        res.json(1)
    }
})

module.exports = router