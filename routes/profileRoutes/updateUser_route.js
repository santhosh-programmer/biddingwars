const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
const { updateUser } = require(path.resolve('api','updateUser'))
let webImages = client.db('BiddingWars').collection('webImages')
let userDetails = client.db('BiddingWars').collection('userDetails')


function verifyRegisterDetails(userName, firstName, lastName, userPassword, confirmPassword) {

    const passPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/ 
    const userPattern = /^[^\s.]{5,}$/

    if(firstName.length < 3 ) {
        return 'First name should be atleast 3 characters'
    }
    else if(lastName.length < 1) {
        return 'Last name should be atleast 1 character'
    }
    else if(userPattern.test(userName)) {
        if (passPattern.test(userPassword)) {
            if(userPassword === confirmPassword) {
                return 'ok'
            }
            else {
                return 'Passwords doesn\'t match'
            }
        }
        else {
            return 'Enter valid password'
        }
    }
    else {
        return 'Enter valid User name' 
    }
}


router.post('/updateUser', async (req, res) => {

    let {firstName, lastName, userPassword, userEmail} = req.body
    let status = verifyRegisterDetails(req.cookies.userName, firstName,lastName, userPassword, userPassword)
    if(status == 'ok'){
        let status = await updateUser(req.cookies.userName, firstName, lastName, userPassword, userEmail )
        if(status === 'ok') {
            let logo = await webImages.findOne({name: 'logo.png'})
            let favicon = await webImages.findOne({name: 'favicon.png'})
            let user = await userDetails.findOne({userName: req.cookies.userName})
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
        else 
        res.send(status)
    }
    else {
        res.send(status)
    }
})

module.exports = router