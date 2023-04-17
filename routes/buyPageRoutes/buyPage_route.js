const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let webImages = client.db('BiddingWars').collection('webImages')
let productDetails = client.db('BiddingWars').collection('productDetails')

router.get('/buy', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})  
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let product
    if(req.query.cat == null) {
        product = await productDetails.find({status: { $ne : 'ended'} }).toArray()
    }
    else if(req.query.cat == 'sort' && req.query.opt == 'lth') {
        product = await productDetails.find({status: { $ne : 'ended'} }).sort({currentPrice : 1}).toArray()
    }
    else if(req.query.cat == 'sort' && req.query.opt == 'htl') {
        product = await productDetails.find({status: { $ne : 'ended'} }).sort({currentPrice : -1}).toArray()
    }
    res.render(path.resolve('views','html_files','buyPage.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            products: product,
            category: 'all',
        }
    })
})

module.exports = router