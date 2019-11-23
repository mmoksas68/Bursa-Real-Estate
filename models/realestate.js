var mongoose = require("mongoose");

var realestateSchema = new mongoose.Schema({
    type: String,
    location: {lat: Number, lng: Number},
    neighborhood: String,
    fullArea: Number,
    usableArea: Number,
    price: Number,
    thumbnail: String,
    images: [
         {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Image"
      }
    ],
    description: String,
    name: String,
    furniture: String,
    whichFloor: String,
    age: Number,
    isFirstHand: String,
    numberOfBath: Number,
    typeOfHouse: String,
    numberOfFloor: Number,
    roomNumber: String,
    isFavorite: String
});

module.exports = mongoose.model("Realestate", realestateSchema);