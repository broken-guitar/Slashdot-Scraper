const db = require("../modals");

module.exports = function(app) {

//     // home route return all results from database
//     app.get("/", function(req,res){
//         db.MyModel.find({}).then(function(dbResults){
//             res.render("index", {
//                 msg: "message?",
//                 data: dbResults
//             });
//         });
//     });

// }