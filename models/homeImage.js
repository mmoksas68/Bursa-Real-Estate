var mongoose = require("mongoose");

var homeImageSchema = new mongoose.Schema({
    url: String
});

module.exports = mongoose.model("homeImage", homeImageSchema);