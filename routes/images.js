var express = require("express");
var router = express.Router();
var Realestate = require("../models/realestate");
var Image = require("../models/image");
var mongoose = require("mongoose");

router.get("/realestates/:type/:id/images/new", function(req, res) {
    Realestate.findById(req.params.id, function(err, realestate) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("images/new", { realestate: realestate });
        }
    });
});

router.post("/realestates/:type/:id/images/", function(req, res) {
    Realestate.findById(req.params.id, function(err, realestate) {
        if (err) {
            console.log(err);
        }
        else {
            realestate.save(function(err) {
                if (err) {
                    console.log(err)
                }
                else {
/*                    db.students.update({ name: "joe" }, { $push: { scores: { $each: [90, 92, 85] } } });
*/                  var begin, end;
                    console.log(req.body.image.url);
                    begin = 0;
                    var imagesArray = [];
                    for (var i = 1; i < req.body.image.url.length && i > 0; i++) {

                        end = req.body.image.url.indexOf(' ', i) == -1 ? req.body.image.url.length : req.body.image.url.indexOf(' ', i);
                        console.log("*" + req.body.image.url.substring(begin, end) + "*");

                        var imageToCreate = new Image({
                            _id: new mongoose.Types.ObjectId(),
                            url: req.body.image.url.substring(begin, end)
                        });

                        imageToCreate.save(function(err) {
                            if (err) console.log(err);
                        });
                        
                        imagesArray.push(imageToCreate);
                        
                        while (req.body.image.url.charAt(end + 1) === " ") {
                            end++;
                        }
                        i = end + 1;
                        begin = i;
                    }
                    console.log(imagesArray);
                    
                    Realestate.update({_id: realestate._id}, { $push: { images: { $each: imagesArray } } }, function(err){
                        if(err){
                            console.log(err);
                        } else{
                            console.log(realestate.images);
                        }
                    } );
                            
                    /*realestate.save(function(err) {
                        if (err) console.log(err);
                    });*/
                }
            });
        }

        res.redirect("/realestates/" + req.params.type + "/" + req.params.id);
    });
});

router.delete("/realestates/:type/:id/images/:image_id", function(req, res) {
    Image.findByIdAndRemove(req.params.image_id, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            Realestate.findByIdAndUpdate(req.params.id, {
                $pull: {
                    images: req.params.image_id
                }
            }, function(err, realestate) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect("/realestates/" + req.params.type + "/" + req.params.id);
                }
            });
        }
    });
});

module.exports = router;
