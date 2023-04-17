
function showDialog(id) {
    let element = document.getElementById(id)
    element.showModal()
}

function closeDialog(id) {
    let element = document.getElementById(id)
        window.location.href = window.location.origin + '/sell';
    element.close()
}
