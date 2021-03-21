// // This is where we will connect the application to the backend
// const youtubeLinkForm = document.getElementById("youtube-form");
// const youtubeLink = document.getElementById("youtube-link");

// // sends the link in form of a json
// youtubeLinkForm.onsubmit = function(event) {

//     event.preventDefault();

//     console.log("youtubeLink: " + youtubeLink.value);

//     var jsonData = [{ "link": youtubeLink.value }];

//     console.log(jsonData);

//     jQuery.ajax({
//         url: '/getSummaryFromYoutubeLink',
//         dataType: "json",
//         data: JSON.stringify({Link: jsonData}),
//         cache: false,
//         contentType: "application/json; charset=utf-8",
//         processData: false,
//         method: 'POST',
//         type: 'POST',
//         success: function (data) {
//           console.log("data: " + data);
//           document.getElementById("yt-transcript-text").innerHTML = data;
//         }
//     });
//     console.log("Data successfully sent to backend: youtube link");
// }

// This is where we will connect the application to the backend
/*
const youtubeLinkForm = document.getElementById("youtube-form");
const youtubeLink = document.getElementById("youtube-link");

// sends the link in form of a json
youtubeLinkForm.onsubmit = function(event) {

    event.preventDefault();

    console.log("youtubeLink: " + youtubeLink.value);

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
          console.log("data: " + data);
          document.getElementById("transcript-text").innerHTML = data;
        }
    });
    console.log("Data successfully sent to backend: youtube link");*/
}

const imgForm = document.getElementById("imgForm");
const img = document.getElementById("img");

imgForm.onsubmit = function(event) {
  event.preventDefault();
  const file = img.files[0];
  console.log(file.value);

  const formData = new FormData();
  formData.append("myFiles[]", file);
  console.log(formData);

  jQuery.ajax({
    url: '/uploadIMG',
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    method: 'POST',
    type: 'POST', // For jQuery < 1.9
    success: function (data) {
      console.log("data: " + data);
      document.getElementById("transcript-text").innerHTML = data;
    }
  });
  console.log("Data Sent");
}





// // const uploadForm = document.getElementById("uploadForm");
// // const mp4 = document.getElementById("mp4");

// const uploadForm = document.getElementById("uploadForm");
// const mp4 = document.getElementById("mp4");

// uploadForm.onsubmit = function(event) {

//   event.preventDefault();

//   console.log("mp4 file: " + mp4.value);


//   // var jsonData = [{ "file": mp4.value}];
//   // //var jsonData = [{ "file": mp4.files[0]}];

//   // console.log(jsonData);


// const uploadForm = document.getElementById("uploadForm");
// const mp4 = document.getElementById("mp4");

// uploadForm.onsubmit = function(event) {

//   event.preventDefault();

//   console.log("mp4 file: " + mp4.value);


//   // var jsonData = [{ "file": mp4.value}];
//   // //var jsonData = [{ "file": mp4.files[0]}];

//   // console.log(jsonData);



//   jQuery.ajax({
//       url: '/mp4tomp3',
//       dataType: "json",
//       data: JSON.stringify(jsonData),
//       cache: false,
//       contentType: "application/json; charset=utf-8",
//       processData: false,
//       enctype: "multipart/form-data",
//       method: 'POST',
//       type: 'POST',
//       success: function (data) {
//         console.log("data: " + data);
//       }
//   });
//   console.log("Data successfully sent to backend: file upload");
// }