$(document).ready(function(){
    var key= "AIzaSyCwv5VEi6c-RusUgGpcpIRMnafhPRnc4UY"
    var video=''
    $("form").submit(function(event){
        document.getElementById("videos").length=0
        event.preventDefault()
        var query=$("#search").val()
        vidSearch(key, query,10)
    })
    


    function vidSearch(apiKey, query, results){
        $.get("https://www.googleapis.com/youtube/v3/search?key=" + key + 
        "&type=video&part=snippet&maxResults="+results + "&q="+ query, function(data){
            console.log(data)
        data.items.forEach(item=> {
            video=`
            <iframe width="420" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder=0 allowfullscreen> </iframe>
            `
            $("#videos").append(video)
        });
    })
    }
})