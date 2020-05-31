const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserCommentSchema = new Schema({
    comment: {
        type: String
    },
    articleId: {
        type: String,
        required: true
    },
    // associate with user comment
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    }
}, {
    timestamps: true
});

const UserComment = mongoose.model("UserComment", UserCommentSchema);

module.exports = UserComment;