const { client } = require('./connection')

let userDetails = client.db('BiddingWars').collection('userDetails')

async function loginUser(_userName,_password) {
    try {
        let getStatus = await userDetails.findOne({
            userName : _userName
        })
        if(getStatus) {
            if(getStatus.userPassword === _password) {
            return 'ok'
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

module.exports ={ verifyLoginDetails, loginUser }