const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let webImages = client.db('BiddingWars').collection('webImages')
let userDetails = client.db('BiddingWars').collection('userDetails')

router.get('/profile' , async ( req, res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let user = await userDetails.findOne({userName: req.cookies.userName})
    if(req.cookies.isLogin == 1) {
        console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
        res.render(path.resolve('views', 'html_files', 'profile.ejs'), {
            resource : {
                isLogin : 1,
                webImg : {
                    logo : logo,
                    favicon : favicon
                } ,
                user : user,
                category: 'personal'
            }
        })
    }
    else {
        res.redirect('/')
    }
})

module.exports = router