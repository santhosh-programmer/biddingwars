const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let webImages = client.db('BiddingWars').collection('webImages')
let productDetails = client.db('BiddingWars').collection('productDetails')

router.get('/homeAppliances', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let product = await productDetails.find({category: 'Home Appliances' , status: { $ne : 'ended'} }).toArray()
    res.render(path.resolve('views','html_files','buyPage.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            products: product,
            category: 'homeAppliances',
        }
    })
})

module.exports = router