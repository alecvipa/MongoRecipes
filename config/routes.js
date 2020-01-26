// To bring the scrape.js from scripts
var scrape = require("../scripts/scrape");

// To bring recipes and Notes from the controllers
var recipesController = require("../controllers/recipes");
var notesController = require("../controllers/notes");
console.log(scrape);

module.exports = function(router) {
    // This route renders the home page
    router.get("/", function(req, res){
        res.render("home");
    });
    // This route renders the saved handlebars page
    router.get("/saved", function(req, res){
        res.render("saved");
    });
    // This route connects with recipes and runs the function fetch
    router.get("/api/fetch", function(req, res) {
        recipesController.fetch(function(err, docs) {
            if(!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles today. Check back tomorrow!"
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });
    router.get("/api/recipes", function(req,res){
        var query = {};
        if(req.query.saved) {
            query = req.query;
        }
        recipesController.get(query,function(data){
            res.json(data);
        });
    });
    router.delete("/api/recipes/:id", function(req, res){
        var query = {};
        query._id = req.params.id;
        recipesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    router.patch("/api/recipes", function(req, res){
        recipesController.update(req.body, function(err, data){
            res.json(data);
        });
    });
    router.get("/api/notes/:headline_id?", function(req, res){
        var query = {};
        if(req.params.headline_id) {
            query._id = req.params.headline_id;
        }
        notesController.get(query, function(err, data) {
            res.json(data);
        });
    });
    router.delete("/api/notes/:id", function(req,res){
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    router.post("/api/notes/", function(req, res){
        notesController.save(req.body, function(data){
            res.json(data);
        });
    });
}