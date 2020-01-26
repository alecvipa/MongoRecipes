// Here we require the dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");

// In the next line we set up a port to be either the host designated one or the 3000
var PORT = process.env.PORT || 3000;

// Initiate express app
var app = express();

// This sets up an express router
var router = express.Router();

// Require our routes file pass our router object
require("./config/routes")(router);

// Designate an static directory (in this case public)
app.use(express.static(__dirname + "/public"));

// To connect Handlebars to our express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Use body parser in our app
app.use(bodyParser.urlencoded({
    extended: false
}));

// Have every request go trough our router middleware
app.use(router);

// If deployed, use the deployed database. Otherwise, use the local mongoRecipes database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoRecipes";

// To connect mongoose to our database
mongoose.connect(db, function(error){
    // log any errors connecting with Mongoose
    if(error){
        console.log(error);
    }
    else {
        console.log("mongoose connection is successful!");
    }
});

app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.bbcgoodfood.com/recipes/collection/wrap/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
});

// Listen on the port...
app.listen(PORT, function(){
    console.log("Listening on port:" + PORT);
});