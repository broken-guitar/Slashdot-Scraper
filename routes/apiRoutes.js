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
        db.UserComment.create(req.body)
        .then(function(dbComment) {
            return db.UserComment.findOneAndUpdate({ _id: dbComment._id }, { article: req.params.articleId }, { new: true })
        }).then(function(dbComment) {
            // If we were able to successfully update an Article, send it back to the client
            console.log("dbComment: ", dbComment);
            res.json(dbComment);
        }).catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    app.get("/scrape", function(req, res) {
        
        axios.get("https://slashdot.org/").then(function(response) {
    
            var $ = cheerio.load(response.data);

            $("article[data-fhtype='story']").each(function(i, element) {
                let result = {};
                result.Headline = $(element).find("span.story-title").find("a").text();
                result.Summary = $(element).find("div.body").text().replace(/\r?\n?\t?/g, "");
                result.articleURL = $(element).find("span.story-title").find("a").attr("href");
    
                db.Article.create(result).then(dbArticle => {
                    console.log("created article: ", dbArticle);
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

    app.delete("/comments/:commentId", function(req, res) {
        db.UserComment.findByIdAndRemove(req.params.commentId, function(err, comment) {
            if (err) return next(err);
            res.json(comment);
        });
    });
    // Post.findByIdAndRemove(req.params.id, req.body, function(err, post) {
    //     if (err) return next(err);
    //     res.json(post);
    //    });

    //    Product.findByIdAndRemove(req.params.id, function (err) {
    //     if (err) return next(err);
    //     res.send('Deleted successfully!');
    // })

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