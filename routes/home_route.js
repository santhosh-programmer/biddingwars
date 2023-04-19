const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require('./connection')
let webImages = client.db('BiddingWars').collection('webImages')
let homeImages =  client.db('BiddingWars').collection('homeImages')
let productDetails = client.db('BiddingWars').collection('productDetails')

router.get('/', async ( req, res ) => {
    let webImageList = await webImages.find({}).toArray()
    let homeImageList =  await homeImages.find({}).toArray()
    let furnitureMenu = await productDetails.find( { category : 'Furnitures'} ).limit(3).toArray()
    let vehicleMenu = await productDetails.find( { category : 'Vehicle'} ).limit(3).toArray()
    let antiquesMenu = await productDetails.find( { category : 'Antiques'} ).limit(3).toArray()
    let haMenu = await productDetails.find( { category : 'Home Appliances'} ).limit(3).toArray()
    let electronicsMenu = await productDetails.find( { category : 'Electronics'} ).limit(3).toArray()
    let opMenu = await productDetails.find( { category : 'Other products'} ).limit(3).toArray()

    let isLogin= req.cookies.isLogin

    let webImg = {
        logo : webImageList.find(i => i.name === 'logo.png'),
        favicon: webImageList[1],
    }

    // console.log(furnitureMenu)
    let homeImg = {
        carousel0: homeImageList[0],
        carousel1: homeImageList[1],
        carousel2: homeImageList[2],
        carousel3: homeImageList[3],
        carousel4: homeImageList[4],
    }
    res.render(path.join(__dirname,'../views/html_files/home.ejs'), 
    {resource: {
        isLogin: isLogin,
        webImg : webImg,
        homeImg : homeImg,
        antiquesMenu : antiquesMenu,
        opMenu : opMenu,
        furnitureMenu : furnitureMenu,
        vehicleMenu :  vehicleMenu,
        electronicsMenu : electronicsMenu,
        haMenu : haMenu
    }}
    )
})

module.exports = router