// This is where we will connect the application to the backend
const youtubeLinkForm = document.getElementById("youtube-form");
const youtubeLink = document.getElementById("youtube-link");

// sends the link in form of a json
youtubeLinkForm.onsubmit = function(event) {

    event.preventDefault();

    console.log("OG: " + youtubeLink.value);

    var jsonData = [{ "link": youtubeLink.value }];

    console.log(jsonData);

    jQuery.ajax({
        url: '/getSummaryFromYoutubeLink',
        dataType: "json",
        data: JSON.stringify({Link: jsonData}),
        cache: false,
        contentType: "application/json; charset=utf-8",
        processData: false,
        method: 'POST',
        type: 'POST',
        success: function (data) {
          console.log(data);
        }
    });
    console.log("Data successfully sent to backend");
}