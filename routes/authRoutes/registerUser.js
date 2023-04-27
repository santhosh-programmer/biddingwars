const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let userDetails = client.db('BiddingWars').collection('userDetails')
let webImages = client.db('BiddingWars').collection('webImages')
const nodemailer = require('nodemailer')
require('dotenv').config()

async function mail(id, userName) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILID,
        pass: process.env.MAILPASS,
      },
    });
    let info = await transporter.sendMail({
      from: `Bidding Wars <${process.env.MAILID}>`,
      to: id,
      subject: "Registeration",
      html: `
      <html>
      <head>
      <style>
            body {
                width : 100%
            }
          .main {
              width: 90%;
              margin : 0 auto;
              background-color: rgb(0, 0, 0);
              border-radius: 20px;
          }
          img {
              width: 50%;
              border-radius: 20px;
              margin: 1.5rem 25% 1rem 25%;
          }
          p {
              color: white;
              font-size: 1.3rem;
              text-align: center;
              margin: 1rem 1rem 3rem 1rem;
          }
          button {
              background-color: blue;
              color: white;
              padding: 1rem;
              font-size: 1.1rem;
              text-align: center;
              width: 80%;
              margin: 0 10%;
              margin-bottom: 1.5rem;
              border-radius: 17px;
              border: none;
          }
      </style>
      </head>
  
      <body>  
          <div class="main">
          <img src="https://imgtr.ee/images/2023/04/20/05BS2.png" alt="logo"/>
          
          <p>
          Welcome `+userName+`,
            </p>
            <p>
                Your registeration was successful !!
            </p>
            <a href="biddingwars.onrender.com">
                <button>
                    BUY / SELL
                </button>
            </a>
          </div>
      </body>
      </html>
      `,
    });
  }

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
                await mail(_userEmail,_userName)
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