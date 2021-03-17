const express = require("express");

const app = express();

app.set('view engine', 'ejs');
const port = 80;

app.use(express.static('public'));

// Sends the webpage
app.get("/", function (req, res) {
    console.log("User requested webpage");
    res.render("index");
});

// Turns on the server
app.listen(port, function () {
    console.log("Server has started running on port: " + port);
});
