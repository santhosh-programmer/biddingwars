const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let webImages = client.db('BiddingWars').collection('webImages')

router.get('/sell',async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    res.render(path.resolve('views', 'html_files', 'sell.ejs'), {
        resource: {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon,
            },
            uploadStatus : false
        }
    })
})

module.exports = router