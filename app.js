// Setup NPM libraries
const express = require("express");
const bodyParser = require("body-parser");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fileUpload = require("express-fileupload");
const fs = require("fs");
const { urlencoded } = require("body-parser");

// Import functions in from the other JS files
const mediatosummary = require(__dirname + "/public/scripts/mediatosummary.js");
const youtubesub = require(__dirname + "/public/scripts/youtubesubtitles.js")

// Setup server
const app = express();
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const port = process.env.port || 80;
app.set('view engine', 'jade');
app.use(express.static('public'));


//configure fileupload middleware
app.use(fileUpload({
    useTempFile: true,
    truetempFileDir: "/tmp/"
}))

//Functions (Have diff requests for each file type)
app.post('/uploadMP4', async (req, res) => {
    console.log("Post request received: /uploadMP4");
    console.log(req.files);
    if (req.files) {
        console.log(req.files);
        var file = req.files.mp4;
        console.log(file);
        var filename = file.name;
        console.log(filename);

        file.mv('./tmp/' + filename, function (err) {
            if (err) {
                console.log(err);
            }
        });
        var summary = await mediatosummary.getSummaryFromVideo("tmp/" + filename);
        console.log(summary);
        res.type('html');
        res.write("<h1>Transcript</h1>");
        res.write("<p>"+summary.transcript+"</p><br><br>");
        res.write("<h1>Topics</h1>");
        for(var i=0; i< summary.topics.length; i++) {
            res.write("<h3>"+summary.topics[i].title+"</h3>");
            res.write("<p>"+summary.topics[i].summary+"</p>");
            res.write("<a href=\""+ summary.topics[i].link + "\" target=_blank>"+summary.topics[i].link+"</a><br><br>")
        }
        res.end();
    }
    else {
        console.log('Error');
    }

});

app.post('/uploadMP3', async (req, res) => {
    console.log("Post request received: /uploadMP3");
    console.log(req.files);
    if (req.files) {
        console.log(req.files);
        var file = req.files.mp3;
        console.log(file);
        var filename = file.name;
        console.log(filename);

        file.mv('./tmp/' + filename, function (err) {
            if (err) {
                console.log(err);
            }
        });
        var summary = await mediatosummary.getSummaryFromAudio("tmp/" + filename);
        console.log(summary);
        res.type('html');
        res.write("<h1>Transcript</h1>");
        res.write("<p>"+summary.transcript+"</p><br><br>");
        res.write("<h1>Topics</h1>");
        for(var i=0; i< summary.topics.length; i++) {
            res.write("<h3>"+summary.topics[i].title+"</h3>");
            res.write("<p>"+summary.topics[i].summary+"</p>");
            res.write("<a href=\""+ summary.topics[i].link + "\" target=_blank>"+summary.topics[i].link+"</a><br><br>")
        }
        res.end();
    }
    else {
        console.log('Error');
    }

});

app.post('/uploadImage', (req, res) => {

});

app.post('/uploadYoutube', async (req, res) => {
    console.log("Post request received: /uploadYoutube");
    console.log(req.body);
    var link = req.body["uploadYoutube-link"];
    console.log(link);
    var transcript = await youtubesub.transcript(link);
    var summary = await mediatosummary.getInfo(transcript);
    var result = "";
    result += "<h3>Transcript</h3>";
    result += "<p>"+summary.transcript+"</p><br><br>";
    result += "<h3>Topics</h3>";
    for(var i=0; i< summary.topics.length; i++) {
        result += "<h5>"+summary.topics[i].title+"</h5>";
        result += "<p>"+summary.topics[i].summary+"</p>";
        result += "<a href=\""+ summary.topics[i].link + "\" target=_blank>"+summary.topics[i].link+"</a><br><br>";
    }
    res.send(JSON.stringify(result));
});

app.post('/uploadKeyWords', (req, res) => {
    console.log("Post request received: /uploadKeyWords");
    console.log(req.body);
    var keyWordString = req.body["keyWords"];
    //var topics = mediatosummary.tokenize(keyWordString); //return array
        
    res.type('html');
    res.write("<h1>Topics</h1>");
    for(var i=0; i< topics.length; i++) {
        res.write("<h3>"+topics[i].title+"</h3>");
        res.write("<p>"+topics[i].summary+"</p>");
        res.write("<a href=\""+ topics[i].link + "\" target=_blank>"+summary.topics[i].link+"</a><br><br>")
    }
    res.end();
});

app.post('/uploadTXT', (req, res) => {

});


// Webpages
app.get("/", function (req, res) {
    console.log(req.url + "@" + Date() + " User connected to the Website");
    res.render('index');
});

app.get("/application", function (req, res) {
    console.log(req.url + "@" + Date() + " User requested to use application");
    res.render('application');
});

app.get("/about", function (req, res) {
    console.log(req.url + "@" + Date() + " User requested to use about");
    res.render('about');
});

app.get("/index", function (req, res) {
    console.log(req.url + "@" + Date() + " User requested to use homepage");
    res.render('index');
});

// Turns on Server
app.listen(port, function () {
    console.log("Server has started running on port: " + port);
});
