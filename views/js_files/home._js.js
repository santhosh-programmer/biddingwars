
let carousel = [
    document.getElementById('carousel0'),
    document.getElementById('carousel1'),
    document.getElementById('carousel2'),
    document.getElementById('carousel3'),
    document.getElementById('carousel4'),
]

let n=0

function changeCarousel(n) {
    for (let index = 0; index < 5; index++) {
        if(index == n) {
            document.getElementById('carousel'+index).style.display = 'block'
        }
        else {
            document.getElementById('carousel'+index).style.display = 'none'
        }
    }
}

setInterval(()=> {
    n= (n+1)%5 
    changeCarousel(n)
}, 4000)


function carouselRight() {
    n = (n+1) %5
    changeCarousel(n)
}

function carouselLeft() {
    n = Math.abs((n-1)) % 5
    changeCarousel(n)
}



// --------------------dialog------------------------


function showDialog(id) {
    let element = document.getElementById(id)
    element.showModal()
}

function closeDialog(id) {
    let element = document.getElementById(id)
    element.close()
}


