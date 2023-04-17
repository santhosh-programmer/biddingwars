const { MongoClient } = require('mongodb')
const uri = "mongodb://santhosh-dev:santhoshpgmr@ac-zgg22pc-shard-00-00.edtrsts.mongodb.net:27017,ac-zgg22pc-shard-00-01.edtrsts.mongodb.net:27017,ac-zgg22pc-shard-00-02.edtrsts.mongodb.net:27017/?ssl=true&replicaSet=atlas-qcj3yt-shard-0&authSource=admin&retryWrites=true&w=majority"
const client = new MongoClient(uri)
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