const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let webImages = client.db('BiddingWars').collection('webImages')
let productDetails = client.db('BiddingWars').collection('productDetails')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer(
    { storage : storage}
)

router.post('/sellProduct',upload.single('productImage'), async (req, res) => {
    const product = {
        sellerUserName: req.cookies.userName,
        buyerUserName: '',
        productName: req.body.productName,
        shortDescription: req.body.shortDescription,
        category: req.body.category,
        description: req.body.description,
        startDate: new Date(req.body.startDate).toISOString(),
        endDate: new Date(req.body.endDate).toISOString(),
        reason: req.body.reason,
        initialPrice:  parseInt(req.body.initialPrice),
        currentPrice: parseInt(req.body.initialPrice),
        productImageData: req.file.buffer,
        productImageContentType: req.file.mimetype,
        maxBidUserName : null,
        status: 'waiting'
    }
    await productDetails.insertOne(product)
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    res.render(path.resolve('views', 'html_files', 'sell.ejs'), {
        resource: { 
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon,
            },
            uploadStatus : true
        }
    })
})

module.exports = router