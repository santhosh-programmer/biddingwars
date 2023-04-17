const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let userDetails = client.db('BiddingWars').collection('userDetails')
let webImages = client.db('BiddingWars').collection('webImages')

async function findUser(_userName) {
    try {
        let getStatus = await userDetails.findOne({
            userName : _userName
        })
        if(getStatus) {
            return 0;
        }
        else {
            return 1;
        }
    }
    catch (err) {
        console.error(err)
        return 0;
    }
}

async function insertUser(_userName,_firstName,_lastName,_userPassword,_userEmail) {
    if( await findUser(_userName)) {
        try {
            let insertStatus = await userDetails.insertOne({
                userName: _userName,
                firstName: _firstName,
                lastName: _lastName,
                userPassword: _userPassword,
                userEmail : _userEmail,
                wallet : 0
            })

            if(insertStatus) {
                return 'ok'
            }
            else {
                return 'Failed to register'
            }
        }
        catch (err) {
            console.error(err)
            return 'unknown error...see terminal'
        }
    }
    else {
        return 'User name already exists'
    }
}




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



router.post('/register-user', async (req,res) => {
    let {firstName, lastName, userName, userPassword, confirmPassword, userEmail} = req.body
    console.log(firstName,lastName,userName,userPassword,confirmPassword,userEmail)
    let status = verifyRegisterDetails(userName,firstName,lastName,userPassword,confirmPassword)
    if(status == 'ok'){
        let registerStatus = await insertUser(userName, firstName, lastName, userPassword, userEmail)
        if(registerStatus === 'ok') {
            console.log('registeratin sucess')
            let logo = await webImages.findOne({name: 'logo.png'})
            let favicon = await webImages.findOne({name: 'favicon.png'})
            res.render(path.resolve('views','html_files','login.ejs') , {
                resource : {
                    webImg : {
                        logo : logo,
                        favicon : favicon,
                    },
                    message : null
                }
            })
        }
        else {
            let logo = await webImages.findOne({name: 'logo.png'})
            let favicon = await webImages.findOne({name: 'favicon.png'})
            console.log('insert status: ',registerStatus)
            res.render(path.resolve('views','html_files','register.ejs') , {
                resource : {
                    webImg : {
                        logo : logo,
                        favicon : favicon,
                    },
                    message : registerStatus
                }
            })
        }
        
    }
    else {
        let logo = await webImages.findOne({name: 'logo.png'})
        let favicon = await webImages.findOne({name: 'favicon.png'})
        console.log('verify satus : ', status)
        res.render(path.resolve('views','html_files','register.ejs'), {
            resource : {
                webImg : {
                    logo : logo,
                    favicon : favicon,
                },
                message : status
            }
        })
    }
})



module.exports = router