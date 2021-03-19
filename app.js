// Setup NPM libraries
const express = require("express");
const bodyParser = require("body-parser");

// Import functions in from the other JS files
const mediatosummary = require(__dirname + "/public/scripts/mediatosummary.js");
const youtubesub = require(__dirname + '/public/scripts/youtubesubtitles.js');

// Setup server
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.port || 80;

app.set('view engine', 'jade');
app.use(express.static('public'));

// Functions (Have diff requests for each file type)
app.post('/getSummaryFromAudio', (req, res) => {
    
});

app.post('/getSummaryFromVideo', (req, res) => {
    
});

app.post('/getSummaryFromText', (req, res) => {
    
});

app.post('/getSummaryFromImage', (req, res) => {
    
});

app.post('/submit', function(req, res) {
   console.log("ytSubmit success");
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
