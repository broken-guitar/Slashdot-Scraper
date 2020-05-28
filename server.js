// required modules
var express = require("express");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();


// ### MIDDLEWARE ###
app.use(logger("dev"));
// parse request body as JSON
app.use(express.urlencoded({ extended: true }));
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

app.get("/", function(req, res) {
    db.Article.find({}).then(function(dbResults) {
        let arr = dbResults.map(o => {
            return {headline: o.Headline, summary: o.Summary, url: o.URL}
        });
        res.render("index", {
            msg: "message",
            articleData: arr
        });
    });
    //   res.render("index"); // << the handlbars view (file name before .handlebars) to render
      // example render view, send object (data)
      // res.render("index", {name: "banana"});
});

app.get("/scrape", function(req, res) {
    
    axios.get("https://slashdot.org/").then(function(response) {

        var $ = cheerio.load(response.data);
        //console.log("response.data: ", response.data);
        // console.log("$ ", $);
        $("article[data-fhtype='story']").each(function(i, element) {
            let result = {};
            result.Headline = $(element).find("span.story-title").find("a").text();
            result.Summary = $(element).find("div.body").text().replace(/\r?\n?\t?/g, "");
            result.URL = $(element).find("span.story-title").find("a").attr("href");
            // console.log("result: ", result);

            db.Article.create(result).then(dbArticle => {
                console.log("created article in db: ", dbArticle);
            })
            .catch(err => {
                console.error(err);
            });

        });

        res.send("Scrape Complete");

    })
    .catch(err => {
        console.error(err);
    });

});

app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
});