const { client } = require('./connection')

let userDetails = client.db('BiddingWars').collection('userDetails')

async function insertUser(_userName,_firstName,_lastName,_userPassword,_userEmail) {
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
            return 'ok'
        }
        else {
            return `
            <h1>Failed to register</h1>
            `
        }
    }
    catch (err) {
        console.error(err)
        return 'unknown error...see terminal'
    }
}


async function findUser(_userName) {
    try {
        let getStatus = await userDetails.findOne({
            userName : _userName
        })
        if(getStatus) {
            return 1;
        }
        else {
            return 0;
        }
    }
    catch (err) {
        console.error(err)
        return 1;
    }
}


async function verifyRegisterDetails(userName, firstName, lastName, userPassword, confirmPassword) {

    const passPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/ 
    const userPattern = /^[^\s.]{5,}$/

    if(firstName.length < 3 ) {
        return 'First name should be atleast 3 characters'
    }
    else if(lastName.length < 1) {
        return 'Last name should be atleast 1 character'
    }
    else if (passPattern.test(userPassword)) {
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

module.exports = { verifyRegisterDetails , insertUser }