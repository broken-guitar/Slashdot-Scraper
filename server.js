// required modules
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio")

const db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();


// ### MIDDLEWARE ###

// parse request body as JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// make public a static folder for express engine
app.use(express.static("public"));

// setup handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose will automatically create the mongo database when records are added
mongoose.connect(MONGODB_URI);

// ### ROUTES ###

// require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);

app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
});

app.get("/", function(req, res) {
    db.Article.find({}).then(function(dbResults) {
        res.render("index", {
            msg: "message",
            data: dbResults
        });
    });
    //   res.render("index"); // << the handlbars view (file name before .handlebars) to render
      // example render view, send object (data)
      // res.render("index", {name: "banana"});
})

app.get("/scrape", (req, res) => {
    
    axios.get("https://towardsdatascience.com/").then(function(response) {

        var $ = cheerio.load(response.data);
        console.log("response.data: ", response.data);
        
        $("h3").each(function(i, element) {
            let result = {};
            result.title = $(element).find("div:first-child").text();
            result.summary = $(element).parent().find("div:first-child").find("div:first-child").text();

            console.log("result: ", result);

            // db.Article.create(result).then(dbArticle => {
            //     console.log("created article in db: ", dbArticle);
            // })
            // .catch(err => {
            //     console.error(err);
            // });

        });

        res.send("Scrape Complete");

    });

})