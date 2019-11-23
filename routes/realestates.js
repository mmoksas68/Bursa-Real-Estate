var express = require("express");
var router = express.Router();
var Realestate = require("../models/realestate");
var Image = require("../models/image");
var HomeImage = require("../models/homeImage");


router.get("/", function(req, res) {
    Realestate.find({ isFavorite: "Yes" }, function(err, realestates) {
        if (err) {
            res.redirect("/");
        }
        else {
            HomeImage.find({}, function(err, homeImages) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render("home", { realestates: realestates, homeImages: homeImages });
                }
            });

        }
    });
});




router.get("/realestates/new", function(req, res) {
    res.render("realestates/new");
});

router.get("/realestates/:type", function(req, res) {
    var minPrice = req.query.minPrice ? req.query.minPrice - 1 : 0;
    var maxPrice = req.query.maxPrice ? req.query.maxPrice - (-1) : 100000000;
    var minArea = req.query.minArea ? req.query.minArea - 1 : 0;
    var maxArea = req.query.maxArea ? req.query.maxArea - (-1) : 10000000;
    var searchFilter;

    if (res.locals.filter) {
        if (searchFilter)
            searchFilter = Object.assign(searchFilter, res.locals.filter);
        else
            searchFilter = res.locals.filter;
    }
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        if (searchFilter)
            searchFilter = Object.assign(searchFilter, { name: regex });
        else
            searchFilter = { name: regex };
    }
    if (res.locals.locations) {
        const regex = new RegExp(escapeRegex(res.locals.locations), 'gi');
        if (searchFilter)
            searchFilter = Object.assign(searchFilter, { neighborhood: regex });
        else
            searchFilter = { neighborhood: regex };
    }
    if (searchFilter)
        searchFilter = Object.assign(searchFilter, { price: { $gt: minPrice, $lt: maxPrice }, fullArea: { $gt: minArea, $lt: maxArea } });
    else
        searchFilter = { price: { $gt: minPrice, $lt: maxPrice }, fullArea: { $gt: minArea, $lt: maxArea } };
        
    searchFilter = Object.assign(searchFilter, {type: req.params.type });
    Realestate.find(searchFilter).sort({ price: 1, fullArea: 1 }).exec(function(err, realestates) {
        if (err) {
            console.log(err.message);
            res.redirect("/");
        }
        else {
            res.render("realestates/index", { realestates: realestates, realestateType: req.params.type });
        }
    });
});

router.get("/realestates/:type/:id", function(req, res) {

    Realestate.findById(req.params.id).populate("images").exec(function(err, foundRealestate) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("realestates/show", { realestate: foundRealestate });
        }
    });
});

router.post("/realestates", function(req, res) {
    Realestate.create(req.body.realestate, function(err, createdRealestate) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(createdRealestate);
            res.redirect("/realestates/" + createdRealestate.type);
        }
    });
});

router.get("/realestates/:type/:id/edit", function(req, res) {
    Realestate.findById(req.params.id, function(err, foundRealestate) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("realestates/edit", { realestate: foundRealestate });
        }
    });
});

router.put("/realestates/:type/:id", function(req, res) {
    Realestate.findByIdAndUpdate(req.params.id, req.body.realestate, function(err, updatedRealestate) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(updatedRealestate);
            res.redirect("/realestates/" + req.params.type + "/" + req.params.id);
        }
    });
});

router.delete("/realestates/:type/:id", function(req, res) {
    Realestate.findById(req.params.id, function(err, realestate) {
        if (err) {
            console.log(err);
        }
        else {
            Image.remove({
                _id: {
                    $in: realestate.images
                }
            }, function(err) {
                if (err) {
                    console.log(err);
                }
                else {
                    realestate.remove();
                    res.redirect("/realestates/" + req.params.type);
                }
            });
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
