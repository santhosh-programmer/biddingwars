const express = require('express')
const router = express.Router()

router.get('/logout', (req,res) => {
    res.cookie('isLogin' , 1 ,{
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 0
    })
    res.cookie('userName' , '' ,{
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 0
    })
    res.redirect('/')
})

module.exports = router