const path = require('path')
const { client } = require(path.resolve('routes','connection'))
let userDetails = client.db('BiddingWars').collection('userDetails')

async function updateUser(_userName, _firstName, _lastName, _password, _userEmail) {
    await userDetails.updateOne({ userName : _userName} ,
    
        { $set : { firstName : _firstName, lastName : _lastName, userPassword : _password, userEmail : _userEmail } }
    )
    return 'ok'
}

module.exports = { updateUser }