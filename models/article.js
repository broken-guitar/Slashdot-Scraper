const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    Headline: {
        type: String,
        required: true
    },
    Summary: {
        type: String,
    },
    URL: {
        type: String
    },
    // associate with user comment
    UserComment: {
        type: Schema.Types.ObjectId,
        ref: "UserComment"
    }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article