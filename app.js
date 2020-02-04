var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var realestateRoutes = require("./routes/realestates");
var imageRoutes = require("./routes/images");
var flash = require("connect-flash");
var methodOverride = require("method-override");
var nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//mongoose.connect("mongodb://localhost/seyhan_app");
mongoose.connect("mongodb://mmoksas:emincik123@ds123753.mlab.com:23753/greenbursarealestate",{ useNewUrlParser: true });

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(function(req, res, next) {
    res.locals.filter = req.query.searchResult;
    res.locals.locations = req.query.location;
    if (res.locals.filter) {
        clean(res.locals.filter);
    }
    res.locals.maxPrice = req.query.maxPrice;
    res.locals.minPrice = req.query.minPrice;
    res.locals.minArea = req.query.minArea;
    res.locals.maxArea = req.query.maxArea;
    next();
});

app.use(function(req, res, next) {
   if(req.query.contactForm){
       var send = "phone: " + req.query.contactForm.phone +
                  "\nemail: " + req.query.contactForm.email +     
                  "\nname: " + req.query.contactForm.name +     
                  "\ntext: " + req.query.contactForm.text +
                  "\nurl:" + req.url + "/";
       var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mmusaboksas@gmail.com',
                pass: '74125973680'
            }
        });

        var mailOptions = {
            from: 'mmusaboksas@gmail.com',
            to: 'mmoksas68@gmail.com',
            subject: 'Baf Emlak',
            text: send
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
   } 
   next();
});

app.use(realestateRoutes);
app.use(imageRoutes);

function clean(obj) {
    for (var propName in obj) {
        if (obj[propName] === "" || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
}

app.listen(process.env.PORT||3000, process.env.IP, function() {
    console.log("working...");
});
