const db = require("../modals");

module.exports = function(app) {

    // do something example
    app.get("/scrape", function(req,res){
        db.MyModel.findAll({}).then(function(dbResults){
            res.jston(dbResults);
        });
    });

}