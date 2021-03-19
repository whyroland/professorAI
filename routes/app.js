const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const port = 800;

app.use(express.static('public'));

// Sends the webpage
app.get("/", function (req, res) {
    console.log("User requested webpage");
});

// Turns on the server
app.listen(port, function () {
    console.log("Server has started running on port: " + port);
});
