// Setup NPM libraries
const express = require("express");
const bodyParser = require("body-parser");
const ffmpeg = require("fluent-ffmpeg");
const fileUpload = require("express-fileupload");

// Import functions in from the other JS files
//const mediatosummary = require(__dirname + "/public/scripts/mediatosummary.js");
//const youtubesub = require(__dirname + '/public/scripts/youtubesubtitles.js');
//const youtubesub = require("./public/scripts/youtubesubtitles");
const mediatosummary = require(__dirname + "/public/scripts/mediatosummary.js");
const youtubesub = require(__dirname + "/public/scripts/youtubesubtitles.js")

// Setup server
const app = express();
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use(youtubesub.transcript);

const port = process.env.port || 80;

app.set('view engine', 'jade');
app.use(express.static('public'));

//configure middleware

//configure fileupload middleware
app.use(fileUpload({
    useTempFile: true,
    truetempFileDir:"/tmp/"
}))

//configure ffmpeg library
ffmpeg.setFfmpegPath("C:/FFmpeg/bin/ffmpeg.exe")

// Functions (Have diff requests for each file type)
app.post('/mp4tomp3', (req, res) => {
    //(async () => {
        res.contentType('vid/mp3');
        //res.attachment('audio-output.mp3');

        // //uploaded file
        // req.files.mp4.mv("tmp/" + req.files.mp4.name, function(err){
        //     //if(err) return res.sendStatus(500).send(err);
        //     console.log("File uploaded successfully");
        // });

        // converting mp4 to mps
        var command = ffmpeg('tmp/' + req.files.mp4.name)
            .toFormat('mp3')
            .on('end', function(stdout, stderr){
                console.log("done: successful conversion")
                console.log("output: " + stdout)
            })
            .on('error', function(error) {
                console.log("An error occured: " + error.message)
            })
            .pipe(res)

        console.log(res);
        //var t = mediatosummary.transcribe(res);
        //console.log(t);
        //res.send(JSON.stringify(t));
        
    //});
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
app.get("/", function(req, res) {
    console.log(req.url + "@" + Date() + " User connected to the Website");
    res.render('index');
});

app.get("/application", function(req, res) {
    console.log(req.url + "@" + Date() + " User requested to use application");
    res.render('application');
});

app.get("/about", function(req, res) {
    console.log(req.url + "@" + Date() + " User requested to use about");
    res.render('about');
});

app.get("/index", function(req, res) {
    console.log(req.url + "@" + Date() + " User requested to use homepage");
    res.render('index');
});

// Turns on Server
app.listen(port, function () {
    console.log("Server has started running on port: " + port);
});
