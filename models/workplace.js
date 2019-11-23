var mongoose = require("mongoose");

var workplaceSchema = new mongoose.Schema({
    location: String,
    area: String,
    price: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Workplace", workplaceSchema);