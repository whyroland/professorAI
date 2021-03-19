const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.port || 80;

app.set('view engine', 'jade');
app.use(express.static('public'));

// Webpages
app.get("/", function(req, res) {
    console.log(req.url + "@" + Date() + " User connected to the WEBPAGE");
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
