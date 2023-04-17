function incrementBid() {
    let price = parseInt(document.getElementById('increment').innerHTML.substring(1))
    price = price + price * 0.02
    price = Math.round(price)
    document.getElementById('increment').innerHTML = '\&\#8377;' + price
}

function decrementBid() {
    let price = parseInt(document.getElementById('increment').innerHTML.substring(1))
    price = price - price * 0.0196
    price = Math.round(price)
    if(price >= parseInt(document.getElementById('currentPrice').innerText.substring(1)))
    document.getElementById('increment').innerHTML = '\&\#8377;' + price
}

function closeDialog(id) {
    let element = document.getElementById(id)
    element.close()
}


function showFullscreen() {
    document.getElementById('fullImg').showModal()
}

function leaveFullscreen() {
    document.getElementById('fullImg').close()
}