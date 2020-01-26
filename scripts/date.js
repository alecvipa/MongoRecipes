var theDate = function() {
    var d = new Date();
    var formatted = "";

    formatted += (d.getMonth() + 1) + "_";
    formatted += d.getDate() + "_";
    formatted += d.getFullYear();

    return formatted;

};

module.exports = theDate;