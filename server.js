const express = require('express')
const path = require('path')
const app = express()
const { connectDB }=require('./node_files/connection')
const { verifyRegisterDetails , insertUser } = require('./node_files/registerUser')
const { verifyLoginDetails, loginUser } = require('./node_files/loginUser')
const cookieParser =  require('cookie-parser')
const { client } = require('./node_files/connection')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer(
    { storage : storage}
)
const { updateUser } = require('./node_files/updateUser')


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/views'))
app.set('view engine','ejs')




const port = 80



app.listen(process.env.PORT || port, async () => {
    await connectDB().then(() =>
    console.log(`listening on port localhost:${port}`
    ))
}
)










// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

let webImages = client.db('BiddingWars').collection('webImages')
let homeImages =  client.db('BiddingWars').collection('homeImages')
let productDetails = client.db('BiddingWars').collection('productDetails')
let userBid =  client.db('BiddingWars').collection('userBid')
let myFavourite = client.db('BiddingWars').collection('myFavourite')
let userDetails = client.db('BiddingWars').collection('userDetails')

// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------








// -------------------------HOME-------------------------


app.get('/', async ( req, res ) => {
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
    res.render(path.join(__dirname,'views/html_files/home.ejs'), 
    {resource: {
        isLogin: isLogin,
        webImg : webImg,
        homeImg : homeImg,
    }}
    )
})

app.get('/logout', (req,res) => {
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








// -------------LOGIN-----------------


app.get('/login.html', async(req,res) => {
    // let image = await webImages.findOne({name: 'logo.png'})
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    res.render(path.join(__dirname,'views/html_files/login.ejs'), {
        resource : {
            webImg : {
                logo : logo,
                favicon : favicon
            },
            message: null
        }
    })
})

app.post('/login-user', async (req,res) => {
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
            res.render(path.join(__dirname,'views/html_files/login.ejs'), {
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
            res.render(path.join(__dirname,'views/html_files/login.ejs'), {
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








// ------------------Sell-------------------


app.get('/sell.ejs',async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    res.render(path.join(__dirname,'views/html_files/sell.ejs'), {
        resource: {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon,
            },
            uploadStatus : false
        }
    })
})



app.post('/sellProduct',upload.single('productImage'), async (req, res) => {
    const product = {
        sellerUserName: req.cookies.userName,
        buyerUserName: '',
        productName: req.body.productName,
        shortDescription: req.body.shortDescription,
        category: req.body.category,
        description: req.body.description,
        startDate: new Date(req.body.startDate).toISOString(),
        endDate: new Date(req.body.endDate).toISOString(),
        reason: req.body.reason,
        initialPrice:  parseInt(req.body.initialPrice),
        currentPrice: parseInt(req.body.initialPrice),
        productImageData: req.file.buffer,
        productImageContentType: req.file.mimetype,
        maxBidUserName : null,
        status: 'waiting'
    }
    await productDetails.insertOne(product)
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    res.render(path.join(__dirname,'views/html_files/sell.ejs'), {
        resource: { 
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon,
            },
            uploadStatus : true
        }
    })
})









// -----------------REGISTER-----------------


app.get('/register.html', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    res.render(path.join(__dirname,'views/html_files/register.ejs'), {
        resource : {
            webImg : {
                logo : logo,
                favicon : favicon,
                message : null
            }
        }
    })
})


app.post('/register-user', async (req,res) => {
    let {firstName, lastName, userName, userPassword, confirmPassword, userEmail} = req.body
    let status = await verifyRegisterDetails(userName,firstName,lastName,userPassword,confirmPassword)
    if(status == 'ok'){
        let registerStatus = await insertUser(userName, firstName, lastName, userPassword, userEmail)
        if(registerStatus === 'ok') {
            let logo = await webImages.findOne({name: 'logo.png'})
            let favicon = await webImages.findOne({name: 'favicon.png'})
            res.render(path.join(__dirname,'views/html_files/login.ejs') , {
                resource : {
                    webImg : {
                        logo : logo,
                        favicon : favicon,
                        message : null
                    }
                }
            })
        }
        else {
            let logo = await webImages.findOne({name: 'logo.png'})
            let favicon = await webImages.findOne({name: 'favicon.png'})
            res.render(path.join(__dirname,'views/html_files/register.ejs') , {
                resource : {
                    webImg : {
                        logo : logo,
                        favicon : favicon,
                        message : registerStatus
                    }
                }
            })
        }
        
    }
    else {
        let logo = await webImages.findOne({name: 'logo.png'})
        let favicon = await webImages.findOne({name: 'favicon.png'})
        res.render(path.join(__dirname,'views/html_files/register.ejs') , {
            resource : {
                webImg : {
                    logo : logo,
                    favicon : favicon,
                    message : status
                }
            }
        })
    }
})









// -----------------------favourites-----------------------





app.get('/favourites.html', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let fav = await myFavourite.find({userName : req.cookies.userName}).toArray()
    let product = []
    for(let i=0;i<fav.length;i++){
        let temp = ( await productDetails.findOne({productID : fav[i].productID }))
        if(temp) {
            product.push(temp)
        }
    }
    res.render(path.join(__dirname,'views/html_files/buyPage.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            products: product,
            category: 'fav'
        }
    })
})











// -----------------buy-----------------




app.get('/buy.html', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})  
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let product
    if(req.query.cat == null) {
        product = await productDetails.find({status: { $ne : 'ended'} }).toArray()
    }
    else if(req.query.cat == 'sort' && req.query.opt == 'lth') {
        product = await productDetails.find({status: { $ne : 'ended'} }).sort({currentPrice : 1}).toArray()
    }
    else if(req.query.cat == 'sort' && req.query.opt == 'htl') {
        product = await productDetails.find({status: { $ne : 'ended'} }).sort({currentPrice : -1}).toArray()
    }
    res.render(path.join(__dirname,'views/html_files/buyPage.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            products: product,
            category: 'all',
        }
    })
})

app.get('/vehicle.html', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let product = await productDetails.find({category: 'Vehicle' , status: { $ne : 'ended'} }).toArray()
    res.render(path.join(__dirname,'views/html_files/buyPage.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            products: product,
            category: 'vehicles',
        }
    })
})

app.get('/antiques.html', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let product = await productDetails.find({category: 'Antiques' , status: { $ne : 'ended'} }).toArray()
    res.render(path.join(__dirname,'views/html_files/buyPage.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            products: product,
            category: 'antiques',
        }
    })  
})

app.get('/furnitures.html', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let product = await productDetails.find({category: 'Furnitures' , status: { $ne : 'ended'} }).toArray()
    res.render(path.join(__dirname,'views/html_files/buyPage.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            products: product,
            category: 'furnitures',
        }
    })
})

app.get('/homeAppliances.html', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let product = await productDetails.find({category: 'Home Appliances' , status: { $ne : 'ended'} }).toArray()
    res.render(path.join(__dirname,'views/html_files/buyPage.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            products: product,
            category: 'homeAppliances',
        }
    })
})

app.get('/dress.html', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let product = await productDetails.find({category: 'Dress' , status: { $ne : 'ended'} }).toArray()
    res.render(path.join(__dirname,'views/html_files/buyPage.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            products: product,
            category: 'dress',
        }
    })
})

app.get('/electronics.html', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let product = await productDetails.find({category: 'Electronics' , status: { $ne : 'ended'} }).toArray()
    res.render(path.join(__dirname,'views/html_files/buyPage.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            products: product,
            category: 'electronics',
        }
    })
})

app.get('/otherProducts.html', async (req,res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let product = await productDetails.find({category: 'Other products' , status: { $ne : 'ended'} }).toArray()
    res.render(path.join(__dirname,'views/html_files/buyPage.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            products: product,
            category: 'otherProducts',
        }
    })
})









// ------------------buy Product Page-----------------------


app.get('/buyProduct', async (req, res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let product =  await productDetails.findOne({ productID : req.query.id })
    let bid = await userBid.findOne({userName: req.cookies.userName, productID : req.query.id})
    let isFav = await myFavourite.findOne({userName: req.cookies.userName   , productID: req.query.id})
    let price = 0
    if(bid) {
        price = bid.bestPrice
    }
    res.render(path.join(__dirname,'views/html_files/buyProduct.ejs') , {
        resource : {
            isLogin: req.cookies.isLogin,
            webImg: {
                logo: logo,
                favicon: favicon
            },
            product: product,
            bestPrice: price,
            isFav: (isFav) ? 'yes' : 'no'
        }
    })
})







// -----------------------profile page-------------------------




app.get('/profile.html' , async ( req, res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let user = await userDetails.findOne({userName: req.cookies.userName})
    if(req.cookies.isLogin == 1)
    res.render(path.join(__dirname, 'views/html_files/profile.ejs'), {
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
    else {
        res.redirect('/')
    }
})

app.get('/edit.html' , async ( req, res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let user = await userDetails.findOne({userName: req.cookies.userName})
    if(req.cookies.isLogin == 1)
    res.render(path.join(__dirname, 'views/html_files/profile.ejs'), {
        resource : {
            isLogin : 1,
            webImg : {
                logo : logo,
                favicon : favicon
            } ,
            user : user,
            category: 'edit'
        }
    })
    else {
        res.redirect('/')
    }
})

app.get('/wallet.html' , async ( req, res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let user = await userDetails.findOne({userName: req.cookies.userName})
    if(req.cookies.isLogin == 1)
    res.render(path.join(__dirname, 'views/html_files/profile.ejs'), {
        resource : {
            isLogin : 1,
            webImg : {
                logo : logo,
                favicon : favicon
            } ,
            user : user,
            category: 'wallet'
        }
    })
    else {
        res.redirect('/')
    }
})

app.post('/updateUser', async (req, res) => {

    let {firstName, lastName, userPassword, userEmail} = req.body
    let status = await verifyRegisterDetails(req.cookies.userName, firstName,lastName, userPassword, userPassword)
    if(status == 'ok'){
        let status = await updateUser(req.cookies.userName, firstName, lastName, userPassword, userEmail )
        if(status === 'ok') {
            let logo = await webImages.findOne({name: 'logo.png'})
            let favicon = await webImages.findOne({name: 'favicon.png'})
            let user = await userDetails.findOne({userName: req.cookies.userName})
            res.render(path.join(__dirname, 'views/html_files/profile.ejs'), {
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











// -------------------------------  History -----------------------------


app.get('/sellHistory.html', async (req, res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    let products = await productDetails.find({sellerUserName: req.cookies.userName}).toArray()
    if(req.cookies.isLogin == 1)
    res.render(path.join(__dirname,'views/html_files/history.ejs'), { 
        resource : {
            webImg : {
                logo : logo,
                favicon : favicon
            },
            isLogin : 1,
            products : products,
            category : 'sell'
        }
    })
    else {
        res.redirect('/')
    }
})





app.get('/buyHistory.html', async (req, res) => {
    let logo = await webImages.findOne({name: 'logo.png'})
    let favicon = await webImages.findOne({name: 'favicon.png'})
    // let products = await productDetails.find({buyerUserName: req.cookies.userName}).toArray()
    let products = await productDetails.find( {  $and: [ { maxBidUserName : req.cookies.userName } , { status : 'ended' } ] }).toArray()
    if(req.cookies.isLogin == 1)
    res.render(path.join(__dirname,'views/html_files/history.ejs'), { 
        resource : {
            webImg : {
                logo : logo,
                favicon : favicon
            },
            isLogin : 1,
            products : products,
            category : 'buy'
        }
    })
    else {
        res.redirect('/')
    }
})









// ------------------------------api-----------------------------------


app.get('/api/getCurrentPrice', async (req,res) => {
    let product = await productDetails.findOne({ productID: req.query.id } , {currentPrice : 1})
    res.json({currentPrice : product.currentPrice , status : product.status, isOwn: (product.sellerUserName == req.cookies.userName) ? 'yes' : 'no' })
})


app.get('/api/getBestPrice' , async (req,res) => {
    let bid = await userBid.findOne({productID: req.query.id , userName: req.cookies.userName }, {bestPrice : 1})
    if(bid) {
        res.json(bid.bestPrice)
    }
    else {
        res.json(0)
    }
})


app.get('/api/update', async (req, res) => {
    let productId = req.query.id
    let newPrice = parseInt(req.query.price)
    let userName = req.cookies.userName
    let product =  await productDetails.findOne({ productID:productId } , {currentPrice : 1})
    if(parseInt(product.currentPrice) < newPrice) {
        await productDetails.updateOne({productID : productId} , { $set : {currentPrice : newPrice}})
        await productDetails.updateOne( { productID : productId} , { $set : { maxBidUserName : userName }} )
    }
    if( await userBid.findOne({userName : userName, productID: productId })) {
        await userBid.updateOne({userName : userName, productID: productId} ,{ $set : {bestPrice : newPrice}})
    }
    else {
        await userBid.insertOne({
            userName: userName,
            productID: productId,
            bestPrice: newPrice
        })
    }
    res.json(newPrice)
})


app.put('/api/addFav' , async (req,res) => {
    let productID = req.query.id
    let userName = req.cookies.userName
    if( await myFavourite.findOne({productID : productID , userName : userName})) {
        await myFavourite.deleteOne({userName: userName , productID : productID})
        res.json(0)
    }
    else {
        await myFavourite.insertOne({userName: userName , productID : productID})
        res.json(1)
    }
})


app.get('/api/isFav', async (req,res) => {
    let product = await myFavourite.findOne({ productID: req.query.id , userName : req.cookies.userName } )
    if(product) {
        res.json(1)
    }
    else {
        res.json(0)
    }
})


app.put('/api/updateWallet' , async (req, res) => {
    let money = parseInt(req.query.money)
    await userDetails.updateOne({ userName : req.cookies.userName } ,{ $set : { wallet : money } } )
    res.send('ok')
})

app.get('/api/results', async (req,res) => {
    let query = req.query.id.toString()
    let results = await productDetails.find( {  $and: [{ productName : { $regex : query , $options: 'i'}}, { status : { $ne : 'ended' } }   ] } , {projection : { productName : 1 , productID : 1}} ).limit(6).toArray()
    res.send(results)
})
 








// ----------------------------------------------------------






app.get('/uploadWebImagesPage', ( req, res) => {
    res.render(path.join(__dirname, 'views/html_files/uploadWebImages.ejs'))
})

app.post('/uploadWebImages',upload.single('myImage'), async (req, res ) => {
    const image = {
        name: req.file.originalname ,
        data: req.file.buffer, 
        contentType: req.file.mimetype
    }
    console.log( await webImages.insertOne(image) )
    res.send('see terminal')
    
})





async function getImage() {
    const images = await webImages.find({})
    images.forEach(async i => await webImageList.push(i))
    console.log(await webImageList)
}



app.get('/updateData' ,async (req,res) => {
    await productDetails.updateMany(
        { $set : {category: 'Vehicle'}}
    )
    res.redirect('back')
})