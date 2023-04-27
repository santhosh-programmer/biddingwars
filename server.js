const express = require('express')
const path = require('path')
const { connectDB }=require(path.resolve('routes','connection'))
const app = express()
const cookieParser =  require('cookie-parser')
require('dotenv').config();

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.resolve('views')))
app.set('view engine','ejs')

// const port = parseInt(process.env.PORT)
const port = process.env.PORT || 3000

app.listen(port, async () => {
    await connectDB().then(() =>
    console.log(`listening on port localhost: ${port}`
    ))
}
)

// -------------------------HOME-------------------------

app.get('/', require(path.resolve('routes','home_route.js')))

app.get('/logout', require(path.resolve('routes','authRoutes', 'logout_route.js')))

// -------------LOGIN-----------------

app.get('/login', require(path.resolve('routes','authRoutes', 'login_route.js')))

app.post('/login-user', require(path.resolve('routes','authRoutes', 'loginUser')))

// ------------------Sell-------------------

app.get('/sell', require(path.resolve('routes','sellRoutes', 'sellPage_route.js')))

app.post('/sellProduct', require(path.resolve('routes','sellRoutes', 'sellProduct.js')))

// -----------------REGISTER-----------------

app.get('/register', require(path.resolve('routes','authRoutes', 'register_route.js')))

app.post('/register-user', require(path.resolve('routes','authRoutes', 'registerUser.js')))

// -----------------------favourites-----------------------

app.get('/favourites', require(path.resolve('routes','profileRoutes','favourites_route.js')))

// -----------------buy-----------------

app.get('/buy', require(path.resolve('routes','buyPageRoutes','buyPage_route.js')))

app.get('/vehicle', require(path.resolve('routes','buyPageRoutes','vehiclePage_route.js')))

app.get('/antiques', require(path.resolve('routes','buyPageRoutes','antiquesPage_route.js')))

app.get('/furnitures', require(path.resolve('routes','buyPageRoutes','furniturePage_route.js')))

app.get('/homeAppliances', require(path.resolve('routes','buyPageRoutes','homeAppliancesPage_route.js')))

app.get('/dress',require(path.resolve('routes','buyPageRoutes','dressPage_route.js')))

app.get('/electronics', require(path.resolve('routes', 'buyPageRoutes', 'electronicsPage_route.js')) )

app.get('/otherProducts', require(path.resolve('routes', 'buyPageRoutes', 'otherProducts_route.js')) )

// ------------------buy Product Page-----------------------

app.get('/buyProduct',  require(path.resolve('routes', 'buyPageRoutes', 'buyProduct_route.js')) )

// -----------------------profile page-------------------------

app.get('/profile' ,  require(path.resolve('routes', 'profileRoutes', 'profile_route.js')) )

app.get('/edit' ,  require(path.resolve('routes', 'profileRoutes', 'edit_route.js')) )

app.get('/wallet' ,  require(path.resolve('routes', 'profileRoutes', 'wallet_route.js')) )

app.post('/updateUser', require(path.resolve('routes', 'profileRoutes', 'updateUser_route.js')) )

// -------------------------------  History -----------------------------

app.get('/sellHistory', require(path.resolve('routes', 'historyRoutes', 'sellHistory_route.js')))

app.get('/buyHistory',  require(path.resolve('routes', 'historyRoutes', 'buyHistory_route.js')))

// ------------------------------api-----------------------------------

app.get('/api/getCurrentPrice', require(path.resolve('api','getCurrentPrice.js')))

app.get('/api/getBestPrice' , require(path.resolve('api','getBestPrice.js')))

app.get('/api/update', require(path.resolve('api','update.js')) )

app.put('/api/addFav' , require(path.resolve('api','addFav.js')) )

app.get('/api/isFav', require(path.resolve('api','isFav.js')))

app.put('/api/updateWallet' , require(path.resolve('api','updateWallet.js')))

app.get('/api/results', require(path.resolve('api','results.js')) )

app.get('/api/getWallet', require(path.resolve('api','getWallet.js')) )
 
