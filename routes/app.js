const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const port = 300;

app.set('view engine', 'jade');
app.use(express.static('public'));

// Sends the webpage
app.get("/", function (req, res) {
    console.log("User requested webpage");
    res.render('index');
});

// Turns on the server
app.listen(port, function () {
    console.log("Server has started running on port: " + port);
});
