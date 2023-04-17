function showDialog(id) {
    let element = document.getElementById(id)
    element.showModal()
}

function closeDialog(id) {
    let element = document.getElementById(id)
    element.close()
}

function showPass(str) {
    
    let element = document.getElementById('userPassword')
    if(element.innerHTML == str) {
        element.innerHTML = ''
    }
    else {
        element.innerHTML = str
    }
}

function addMoney() {
    const xhttp = new XMLHttpRequest()
    let money = parseInt(document.getElementById('newMoney').value)
    if (! isNaN(money)) {
        if(money > 100000 ) {
            window.alert('Amount should be less than 100000')
        }
        else {
        let oldmoney = parseInt(document.getElementById('money').innerText.substring(1))    
        let newMoney = money + oldmoney
        xhttp.onload = () => {
            document.getElementById('money').innerHTML = '\&\#8377;' + newMoney.toString()
            document.getElementById('newMoney').value = ''
        }
        xhttp.open('PUT', window.location.origin + '/api/updateWallet/?money=' + newMoney)
        xhttp.send()
        }
    }
}