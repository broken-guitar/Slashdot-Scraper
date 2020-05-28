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
mongoose.connect(MONGODB_URI);

// ### ROUTES ###

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
});

app.get("/", function(res,req){
      res.render("index"); // << the handlbars view (file name before .handlebars) to render
      // example render view, send object (data)
      // res.render("index", {name: "banana"});
})

app.get("/scrape", (res, req) => {
    
    axios.get("https://www.reddit.com/r/mildlyinteresting/").then(function(response) {

        var $ = cheerio.load(response.data);

        $("div[theme]").each(function(i, element) {

            var title = $(element).find("h3").text();
            var imgLink = $(element).parent().parent().find("a").attr("href");

            db.scrapedData.insert({"title": title, "link": imgLink}, (err, data) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(data);
                }
            });

        });
    });

})