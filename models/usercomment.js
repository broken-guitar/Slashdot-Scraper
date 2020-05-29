const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserCommentSchema = new Schema({
    comment: {
        type: String
    }
}, {
    timestamps: true
});

const UserComment = mongoose.model("UserComment", UserCommentSchema);

module.exports = UserComment;