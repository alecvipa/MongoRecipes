$(document).ready(function(){
    var articleCont = $(".article-container");

    $(document).on("click",".btn.save", handleRecipeSave);
    $(document).on("click",".scrape-new", handleRecipeScrape);

    // To run all one the page is ready
    initPage();

    function initPage() {
        articleCont.empty();
        $.get("/api/recipes?saved=false")
        .then(function(data){
            if(data && data.length) {
                renderRecipes(data);
            }
            else {
                renderEmpty();
            }
        });
    }

    function renderRecipes(){
        var recipesPanels = [];

        for(var i = 0; i < recipes.length; i++) {
            recipesPanels.push(createPanel(articles[i]));
        }

        articleCont.append(recipesPanels);
    }

    function createPanel(recipe){
        var panel = $([
            "<div class= 'panel panel-default'>",
            "<div class= 'panel-heading'>",
            "<h3>",
            recipe.headline,
            "<a class= 'btn btn-success save'>",
            "Save recipe",
            "</a>",
            "</h3>",
            "</div>",
            "<div class= 'panel-body'>",
            recipe.description,
            "</div>",
            "</div>"
        ].join(""));

        panel.data("_id",recipe._id);

        return panel;
    }

    function renderEmpty(){
        var emptymssg = 
        $([
            "<div class= 'primary text-center'>",
            "<h4>You don't have any recipes added. SORRY</h4>",
            "</div>",
            "<div class= 'panel panel-default'>",
            "<div class= 'panel-heading text-center'>",
            "<h3> What should we do? </h3>",
            "</div>",
            "<div class= 'panel-body text-center'>",
            "<h4><a class= 'scrape-new'> Scrape New Recipes</a></h4>",
            "<h4><a href= '/saved'>Go to saved recipes</a></h4>",
            "</div>",
            "</div>"
        ].join(""));
        articleCont.append(emptymssg);
    }

    function handleRecipeSave(){
        var recipeToSave = $(this).parents(".panel").data();
        recipeToSave.saved = true;

        $.ajax({
            method: "PATCH",
            url: "/api/recipes",
            data: recipeToSave
        })
        .then(function(data){
            if(data.ok) {
                initPage();
            }
        });
    }
    function handleRecipeScrape(){
        $.get("/api/fetch")
        .then(function(data) {
            initPage();
            bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>");
        });
    }


});