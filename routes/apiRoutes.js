const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function(app) {

    // app.commentWatch = function() {    
    //     db.UserComment.watch().on("change", data => {
    //         console.log("change data: ", data);
    //     });
    // }
    // get all scraped artiles from database
    app.get("/", function(req, res) {
        db.Article.find({}).sort({createdAt: -1}).then(function(dbResults) {
            let articleArray = dbResults.map(o => {
                return { dataId: o._id.toString(), headline: o.Headline, summary: o.Summary, url: o.articleURL}
            });
            res.render("index", {
                msg: "message",
                articleData: articleArray
            });
        });
    });

    // get all comments for an article
    app.get("/comments/:articleId", function(req, res) {
        db.UserComment.find({ articleId: req.params.articleId }).sort({createdAt: -1})
        .then(function(dbResults) {
            res.json(dbResults);
        });
    });
    
    // ADD comment and associate to article
    app.post("/comments/:articleId", function(req, res) {
        console.log("comm req.body: ", req.body);
        db.UserComment.create(req.body)
        .then(function(dbComment) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.UserComment.findOneAndUpdate({ _id: req.params.articleId }, { UserComment: dbComment._id }, { new: true });
        })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
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
                result.articleURL = $(element).find("span.story-title").find("a").attr("href");
                // console.log("result: ", result);
    
                db.Article.create(result).then(dbArticle => {
                    console.log("created article in db: ", dbArticle);
                })
                .catch(err => {
                    console.error(err);
                });
    
            });
    
            res.redirect("/");
    
        })
        .catch(err => {
            console.error(err);
        });
    
    });

    // EXAMPLE to populate many notes
    app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
          // ..and populate all of the notes associated with it
          .populate("note")
          .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      });

}