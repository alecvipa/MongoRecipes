// Here we are requiring our date and scrape scripts we made before
var scrape = require("../scripts/scrape");
var theDate =  require("../scripts/date");

// Here we bring our Recipes model
var Recipe = require("../models/Recipe");

module.exports = {
    fetch: function(cb){
        scrape(function(data){
            var articles = data;
            for (var i=0; i < articles.length; i++) {
                articles[i].date = theDate();
                articles[i].saved = false;
            }

            Recipe.collection.insertMany(articles, {ordered:false}, function(edd, docs){
                cb(err, docs);
            });
        });
    },
    delete: function(query, cb){
        Recipe.remove(query, cb);
    },
    get: function(query, cb) {
        Recipe.find(query)
        .sort({
            _id: -1
        })
        .exec(function(err, doc) {
            cb(doc);
        });
    },
    update: function(query, cb) {
        Recipe.update({_id: query._id}, {
            $set: query
        }, {}, cb);
    }
}
