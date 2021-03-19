// Any function that you want to be used in other files put it in here
module.exports = {
  
}

/*
form.onsubmit = function(event) {
  document.getElementById("transcript-text").innerHTML = "https://www.youtube.com/watch?v=6-84CClZ06A&t=6s";

  event.preventDefault();

  var request = require("request");
  var {DOMParser} = require("xmldom");

  
  var link = document.getElementById("youtube-link").value;
  link = "https://www.youtube.com/watch?v=6-84CClZ06A&t=6s";
  var id;
  var captionURL;
  const options1 = {
    url: 'https://www.youtube.com/get_video_info?html5=1&video_id=' + getID(link),
    method: 'GET',
  };
  request(options1, function(err, res, body) {
    captionURL = getXML(body);
    var i = captionURL.indexOf("https");
    captionURL = captionURL.substring(i, captionURL.length-1);
    const options2 = {
      url: captionURL,
      method: 'GET',
    };
    request(options2, function(err, res, body) {
      var parser = new DOMParser();
      xmlDoc = parser.parseFromString(body, "text/xml");
      getCaption(xmlDoc);
    });
  });
}*/

function getXML(res) {
  var begin = res.indexOf("captionTracks");
  var end = res.indexOf("%2C%22name")
  var captionTrack = res.substring(begin, end);
  captionTrack = decodeURIComponent(captionTrack);
  for(var i=0; i<captionTrack.length; i++) {
    if(captionTrack.substring(i, i+6) == "\\u0026") {
      captionTrack=captionTrack.substring(0,i) + "&" + captionTrack.substring(i+6);
    }
  }
  return captionTrack;
}

var HTML_captions = "";
function getCaption(data) {
  try {
    for (var i = 0; i < data.getElementsByTagName("transcript")[0].childNodes.length; i++) {
      var sentence = data.getElementsByTagName("transcript")[0].childNodes[i].childNodes[0].nodeValue + "\n";
      HTML_captions += fixSpacing(sentence);
    }

    fillData();

  } catch (err) {
    console.log(err);
    alert('Error at getCaption function - see console form more details.');
  }
}

function fillData() {
  try {
    document.getElementById("transcript-text").innerHTML = HTML_captions;
  } catch (err) {
    console.log(err);
    alert('Error at fillData function - see console form more details.');
  }
}

function getID(s) {
  for( var i=0; i<s.length; i++) {
    if(s.substring(i, i+5) == "ch?v=") {
      return s.substring(i+5);
    }
  }
  //https://www.youtube.com/watch?v=6-84CClZ06A
}

function fixSpacing(s) {
  for(var i=0; i<s.length-5; i++) {
    if(s.substring(i, i+1) == "&") {
      s=s.substring(0,i)+"\'" + s.substring(i+5);
    }
    else if(s.substring(i, i+4) == "#39;") {
      s=s.substring(0,i)+ s.substring(i+4);
    }
  }
  return s;
}