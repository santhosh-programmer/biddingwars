const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let webImages = client.db('BiddingWars').collection('webImages')
let myFavourite = client.db('BiddingWars').collection('myFavourite')
let productDetails = client.db('BiddingWars').collection('productDetails')

router.get('/favourites', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let fav = await myFavourite.find({userName : req.cookies.userName}).toArray()
    let product = []
    for(let i=0;i<fav.length;i++){
        let temp = ( await productDetails.findOne({productID : fav[i].productID }))
        if(temp) {
            product.push(temp)
        }
    }
    res.render(path.resolve('views', 'html_files', 'buyPage.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            products: product,
            category: 'fav'
        }
    })
})


module.exports = router