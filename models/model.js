const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MyModelSchema = new Schema({
    something1: {
        type: String,
        required: true
    },
    something2: {
        type: String,
        required: false
    },
    // associated thing
    otherthing: {
        type: Schema.Types.ObjectId,
        ref: "AssociatedModel"
    }
});

const MyModel = mongoose.model("MyModel", MyModelSchema);

module.exports = MyModel