const express = require('express')
const router = express.Router()
const path = require('path')
const { client } = require(path.resolve('routes','connection'))
const nodemailer = require('nodemailer')
let webImages = client.db('BiddingWars').collection('webImages')
let userDetails = client.db('BiddingWars').collection('userDetails')
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
    await transporter.sendMail({
      from: `Bidding Wars <${process.env.MAILID}>`,
      to: id,
      subject: "Login",
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
                Welcome back `+userName+`,
            </p>
            <p>
                Your login was successful !!
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

async function loginUser(_userName,_password) {
    try {
        let getStatus = await userDetails.findOne({
            userName : _userName
        })
        if(getStatus) {
            if(getStatus.userPassword === _password) {
            return getStatus.userEmail
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
        if(loginStatus.includes('@')) {
            await mail(loginStatus,userName)
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
            res.cookie('userEmail' , loginStatus ,{
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