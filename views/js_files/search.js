function showResult(str) {
    if (str.length==0) {
        document.getElementById("livesearch").innerHTML="";
        document.getElementById("livesearch").style.border="0px";
        return;
    }
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        if (this.readyState==4 && this.status==200) {
            let results = JSON.parse(this.response)
            let display = `` 
            results.forEach(result => {
                display = display + `<a href="buyProduct?id=` + result.productID + `"> <p>` +result.productName + `</p></a>`
            });      
            document.getElementById("livesearch").innerHTML = display
        }
    }
    xmlhttp.open("GET",window.location.origin + '/api/results/?id=' + str ,true);
    xmlhttp.send();
}