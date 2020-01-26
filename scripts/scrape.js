// scrape script
// ----------------

// We are requiring the following packages in order to make possible our scraping
var request = require("request");
var cheerio = require("cheerio");

var scrape =  function () {

    request("https://www.bbcgoodfood.com/recipes/collection/wrap", function(err, res, body){

        var $ = cheerio.load(body);

        var articles = [];

        $("article").each(function(i, element){
            var head = $(this).children(".teaser-item__title").text().trim();
            var description = $(this).children(".field-item").text().trim();
            var link = $(this).children("a").attr("href");
            var img = $(this).find("img").attr("src");

            if (head && description && link && img){
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var descriptionNeat = description.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var linkNeat = link.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var imgNeat = img.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataToAdd = {
                    headline: headNeat,
                    desc: descriptionNeat,
                    href: linkNeat,
                    image: imgNeat
                };

                articles.push(dataToAdd);
            }
        });
        return articles;
    });
};

module.exports = scrape; 