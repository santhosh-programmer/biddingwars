const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes', 'connection'))
let userDetails = client.db('BiddingWars').collection('userDetails')

router.put('/api/updateWallet' , async (req, res) => {
    let money = parseInt(req.query.money)
    await userDetails.updateOne({ userName : req.cookies.userName } ,{ $set : { wallet : money } } )
    res.send('ok')
})

module.exports = router