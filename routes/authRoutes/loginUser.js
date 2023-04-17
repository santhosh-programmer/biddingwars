const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let webImages = client.db('BiddingWars').collection('webImages')

let userDetails = client.db('BiddingWars').collection('userDetails')

async function loginUser(_userName,_password) {
    try {
        let getStatus = await userDetails.findOne({
            userName : _userName
        })
        if(getStatus) {
            if(getStatus.userPassword === _password) {
            return 'ok'
            }
            else {
                return "wrong password"
            }
        }
        else {
            return 'User not found'
        }
    }
    catch (err) {
        console.error(err)
        return 'unknown error...see terminal'
    }
}

function verifyLoginDetails(userName, userPassword) {
    const passPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/ 
    const userPattern = /^[^\s.]{5,}$/

    if(userPattern.test(userName)) {
        if(passPattern.test(userPassword)) {
            return 'ok'
        }
        else {
            return 'Enter valid password'
        }
    }
    else {
        return 'Enter valid user name'
    }
}

router.post('/login-user', async (req,res) => {
    let {userName, userPassword} = req.body
    let status = verifyLoginDetails(userName,userPassword)
    if(status === 'ok') {
        let loginStatus =  await loginUser(userName,userPassword)
        if(loginStatus === 'ok') {
            res.cookie('isLogin' , 1 ,{
                secure: true,
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 6.048e+8
            })
            res.cookie('userName' , userName ,{
                secure: true,
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 6.048e+8
            })
            res.redirect('/')
        }
        else
        {
            let logo = await webImages.findOne({name: 'logo.png'})
            let favicon = await webImages.findOne({name: 'favicon.png'})
            res.render(path.resolve('views','html_files','login.ejs'), {
                resource : {
                    webImg : {
                        logo : logo,
                        favicon : favicon
                    },
                    message: loginStatus
                }
            })
        }
    }
    else {
        {
            let logo = await webImages.findOne({name: 'logo.png'})
            let favicon = await webImages.findOne({name: 'favicon.png'})
            res.render(path.resolve('views','html_files','login.ejs'), {
                resource : {
                    webImg : {
                        logo : logo,
                        favicon : favicon
                    },
                    message: status
                }
            })
        }
    }
})

module.exports = router