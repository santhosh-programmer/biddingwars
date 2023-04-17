function showDialog(id) {
    let element = document.getElementById(id)
    element.showModal()
}

function closeDialog(id) {
    let element = document.getElementById(id)
    element.close()
}


function showSort() {
    document.getElementById('s1').style.display = 'block'
    document.getElementById('s2').style.display = 'block'
    document.getElementById('s3').style.display = 'block'
    document.getElementById('bs').style.display = 'block'
    document.getElementById('sort').style.display = 'none'   
}   

function backSort() {
    document.getElementById('s1').style.display = 'none'
    document.getElementById('s2').style.display = 'none'
    document.getElementById('s3').style.display = 'none'
    document.getElementById('bs').style.display = 'none'
    document.getElementById('sort').style.display = 'block'   
}  