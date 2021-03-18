function getXML(id) {
    var URI = "https://youtube.com/get_video_info?video_id=" + id;
    return URI;
}

function httpGet()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp.open("GET", "https://youtube.com/get_video_info?video_id=Mt6o3VoJkgU");
    xhttp.send();
}

httpGet();