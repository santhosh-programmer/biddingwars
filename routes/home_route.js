const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require('./connection')
let webImages = client.db('BiddingWars').collection('webImages')
let homeImages =  client.db('BiddingWars').collection('homeImages')

router.get('/', async ( req, res ) => {
    let webImageList = await webImages.find({}).toArray()
    let homeImageList =  await homeImages.find({}).toArray()

    let isLogin= req.cookies.isLogin

    let webImg = {
        logo : webImageList.find(i => i.name === 'logo.png'),
        favicon: webImageList[1],
    }

    let homeImg = {
        antiquesMenu: homeImageList[0],
        bikesMenu: homeImageList[1],
        furnituresMenu: homeImageList[2],
        electronicsMenu: homeImageList[3],
        haMenu: homeImageList[4],
        opMenu: homeImageList[5],
        carousel0: homeImageList[6],
        carousel1: homeImageList[7],
        carousel2: homeImageList[8],
        carousel3: homeImageList[9],
        carousel4: homeImageList[10],
    }
    res.render(path.join(__dirname,'../views/html_files/home.ejs'), 
    {resource: {
        isLogin: isLogin,
        webImg : webImg,
        homeImg : homeImg,
    }}
    )
})

module.exports = router