function getXML(id) {
    var URI = "https://youtube.com/get_video_info?video_id=" + id;
    return URI;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

httpGet(getXML("Mt6o3VoJkgU"));