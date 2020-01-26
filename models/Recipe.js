var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var recipeSchema = new Schema({
    headline: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    date: String,
    saved: {
        type: Boolean,
        default: false
    }
});

var Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;