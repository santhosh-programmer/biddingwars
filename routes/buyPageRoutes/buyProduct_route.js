const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let webImages = client.db('BiddingWars').collection('webImages')
let productDetails = client.db('BiddingWars').collection('productDetails')
let userBid =  client.db('BiddingWars').collection('userBid')
let myFavourite = client.db('BiddingWars').collection('myFavourite')

router.get('/buyProduct', async (req, res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let product =  await productDetails.findOne({ productID : req.query.id })
    let bid = await userBid.findOne({userName: req.cookies.userName, productID : req.query.id})
    let isFav = await myFavourite.findOne({userName: req.cookies.userName , productID: req.query.id})
    let price = 0
    if(bid) {
        price = bid.bestPrice
    }
    res.render(path.resolve('views','html_files','buyProduct.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            product: product,
            bestPrice: price,
            isFav: (isFav) ? 'yes' : 'no'
        }
    })
})

module.exports = router