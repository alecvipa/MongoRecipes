$(document).ready(function(){
    var articleCont = $(".article-container");

    $(document).on("click",".btn.delete", handleRecipeDelete);
    $(document).on("click",".btn.notes", handleRecipeNotes);
    $(document).on("click",".btn.save", handleNoteSave);
    $(document).on("click",".btn.note-delete", handleNoteDelete);

    // To run all one the page is ready
    initPage();

    function initPage() {
        articleCont.empty();
        $.get("/api/recipes?saved=true")
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

    function renderNotesList(){
        var notesToRender = [];
        var currentNote;

        if(!data.notes.length) {
            currentNote = [
                "<li class= 'list-group-item'>",
                "No notes for this recipe yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            for(var i=0 ; i < data.notes.length; i++) {
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);

                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }

    function createPanel(recipe){
        var panel = $([
            "<div class= 'panel panel-default'>",
            "<div class= 'panel-heading'>",
            "<h3>",
            recipe.headline,
            "<a class= 'btn btn-success save'>",
            "Delete from saved",
            "</a>",
            "<a class= 'btn btn-info notes'>Recipe's Notes</a>",
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
            "<h4>You don't have any recipes saved. SORRY</h4>",
            "</div>",
            "<div class= 'panel panel-default'>",
            "<div class= 'panel-heading text-center'>",
            "<h3> Would you like to browse for available recipes? </h3>",
            "</div>",
            "<div class= 'panel-body text-center'>",
            "<h4><a class= 'scrape-new'> Scrape New Recipes</a></h4>",
            "<h4><a href= '/'>Browse recipes</a></h4>",
            "</div>",
            "</div>"
        ].join(""));
        articleCont.append(emptymssg);
    }

    function handleRecipeDelete(){
        var recipeToDelete = $(this).parents(".panel").data();

        $.ajax({
            method: "DELETE",
            url: "/api/recipes/" + recipeToDelete._id
        })
        .then(function(data){
            if(data.ok) {
                initPage();
            }
        });
    }
    function handleRecipeNotes(){

        var currentRecipe = $(this).parents(".panel").data();

        $.get("/api/notes/" + currentRecipe._id)
        .then(function(data) {
            var modalText = [
                "<div class= 'container-fluid text-center'>",
                "<h4>Notes for article: ",
                currentRecipe._id,
                "</h4>",
                "<hr />",
                "<ul class= 'list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentRecipe._id,
                notes: data || []
            };

            $(".btn.save").data("recipe", noteData);

            renderNotesList(noteData);
        });
    }

    function handleNoteSave() {
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if(newNote){
            noteData = {
                _id: $(this).data("recipe")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function(){
                bootbox.hideAll();
            }); 
        }

    }

    function handleNoteDelete() {
        var noteToDelete = $(this).data("_id");

        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function(){
            bootbox.hideAll();
        });
    }


});