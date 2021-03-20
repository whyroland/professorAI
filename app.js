// Setup NPM libraries
const express = require("express");
const bodyParser = require("body-parser");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fileUpload = require("express-fileupload");
const fs = require("fs");

// Import functions in from the other JS files
const mediatosummary = require(__dirname + "/public/scripts/mediatosummary.js");
const youtubesub = require(__dirname + "/public/scripts/youtubesubtitles.js")

// Setup server
const app = express();
app.use(bodyParser.json());
const port = process.env.port || 80;
app.set('view engine', 'jade');
app.use(express.static('public'));


//configure fileupload middleware
app.use(fileUpload({
    useTempFile: true,
    truetempFileDir: "/tmp/"
}))

//Functions (Have diff requests for each file type)
app.post('/mp4tomp3', async (req, res) => {
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
        var summary = await mediatosummary.getSummary("tmp/" + filename);
        console.log(summary);
        res.type('html');
        res.write("<h1>Transcript</h1>");
        res.write("<p>"+summary.transcript+"</p>");
        res.write("<h1>Topics</h1>");
        for(var i=0; i< summary.topics.length; i++) {
            res.write("<h3>"+summary.topics[i].title+"</h3>");
            res.write("<p>"+summary.topics[i].summary+"</p>");
            res.write("<a href=\""+ summary.topics[i].link +">"+summary.topics[i].link+"</a>")
        }
        res.end();
    }
    else {
        console.log('Error');
    }

});

app.post('/getSummaryFromAudio', (req, res) => {

});

app.post('/getSummaryFromVideo', (req, res) => {

});

app.post('/getSummaryFromText', (req, res) => {

});

app.post('/getSummaryFromImage', (req, res) => {

});

app.post('/getSummaryFromYoutubeLink', async (req, res) => {
    console.log("Post request received: /getSummaryFromYoutubeLink");
    var link = req.body.Link[0].link;
    console.log(link);
    var transcript = await youtubesub.transcript(link);
    res.send(JSON.stringify(transcript));
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
