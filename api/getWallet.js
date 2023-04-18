const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes', 'connection'))
let userDetails = client.db('BiddingWars').collection('userDetails')

router.get('/api/getWallet' , async (req, res) => {
    let money = await userDetails.findOne({userName : req.cookies.userName} ,{projection : {wallet : 1}})
    console.log(money.wallet)
    res.json({money : money.wallet})
})

module.exports = router