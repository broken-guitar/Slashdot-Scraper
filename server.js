// required modules
const express = require("express");
const logger = require("morgan");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");



const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();


// ### MIDDLEWARE ###
app.use(logger("dev"));
// parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// make public a static folder for express engine
app.use(express.static("public"));

// setup handlebars
app.engine("handlebars", exphbs({
    defaultLayout: "main",
    helpers: {
        embedDataId: function(test) {
            console.log("dataId: ", this);
        }
    }
}));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose will automatically create the mongo database when records are added
mongoose.connect(MONGODB_URI);

// ### ROUTES ###

require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);

app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
});