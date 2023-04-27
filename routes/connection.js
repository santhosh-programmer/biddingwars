const { MongoClient } = require('mongodb')
require('dotenv').config()
const uri = process.env.DB_URI
const client = new MongoClient(uri)

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