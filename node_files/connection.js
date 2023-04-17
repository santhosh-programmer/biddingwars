const { MongoClient } = require('mongodb')
const uri = "mongodb+srv://santhosh-dev:santhoshpgmr@biddingwars.edtrsts.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  })

let userDetails 

function getUserDetails() {
    return userDetails
}

async function connectDB () {
    try {
        await client.connect()
        console.log(`Database Connected successfully`)
        return 1;
    }
    catch (err) {
        console.log(`Error: ${err}`)
    }
}

module.exports = { connectDB , client}