// $.ajax({
//   type: "GET",
//   url: "http://video.google.com/timedtext?type=track&v=zenMEj0cAC4&id=0&lang=en",
//   crossDomain: true,
// }).done(function(data) {
//   getCaption(data);
// });

var caption;

var parser, xmlDoc;
var HTML_captions = "";
function getCaption(data) {
  try {
    for (var i = 0; i < data.getElementsByTagName("transcript")[0].childNodes.length; i++) {
      var sentence = data.getElementsByTagName("transcript")[0].childNodes[i].innerHTML + "<br/>";
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

function cb(err, res) {
  if (err) {
    console.log('ERROR:', err);
  }
  else {
    return getXML(res);
  }
}

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

function xml() {
  var yt = require('youtube.get-video-info');
  console.log(yt.retrieve('Mt6o3VoJkgU', cb));
}
xml();



