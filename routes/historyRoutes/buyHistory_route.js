const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let webImages = client.db('BiddingWars').collection('webImages')
let productDetails = client.db('BiddingWars').collection('productDetails')

router.get('/buyHistory', async (req, res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let products = await productDetails.find( {  $and: [ { maxBidUserName : req.cookies.userName } , { status : 'ended' } ] }).toArray()
    if(req.cookies.isLogin == 1)
    res.render(path.resolve('views', 'html_files', 'history.ejs'), { 
        resource : {
            webImg : {
                logo : logo,
                favicon : favicon
            },
            isLogin : 1,
            products : products,
            category : 'buy'
        }
    })
    else {
        res.redirect('/')
    }
})


module.exports = router