
// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Bear     = require('./models/bear');
var mongoose =require('mongoose');
var mongodb='mongodb://localhost:27017/Mngodb';
const validator=require('validator');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8068;        // set our port
var Schema =mongoose.Schema;
var details=new Schema({
    username:{type:String,unique:true},
    email:{type:String,unique:true, validate:{validator: validator.isEmail , message: 'Invalid email.' }},
    name :{type:String,validate:{validator:validator.isAlphanumeric, message:'should be alphanumeric'}}
});
var model=mongoose.model('Model',details);
mongoose.connect(mongodb);


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/bears')
// more routes for our API will happen here
 // create a bear (accessed at POST http://localhost:8080/api/bears)
 .post(function(req, res){
    var myData = new model();
    myData.username=req.body.uname;
    myData.email=req.body.em;
    myData.name=req.body.na;
//     myData.save()
//       .then(item => {
//         res.send("item saved to database");
//       })
//       .catch(err => {
//         res.status(400).send("unable to save to database");
//       });
//   })
myData.save((err, info) => {

    if(err)
    res.json({status : "error",message: "wrong format"});

    else
    res.json({status: "ok",data:info._id});

});
 });
 router.route('/bears/:myData_id')
.get(function(req, res) {
    model.findById(req.params.myData_id,function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
})
    .put(function(req, res) {

        // use our bear model to find the bear we want
        model.findById(req.params.myData_id, function(err, bear) {

            if (err)
                res.send(err);

            myData.name = req.body.name;  // update the bears info

            // save the bear
            myData.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'updated!' });
            });

        });
    })
    .delete(function(req, res) {
        model.remove({
            _id: req.params.myData_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// router.route('/bears/:bear_id')

//     // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
//     .get(function(req, res) {
//         Bear.findById(req.params.bear_id, function(err, bear) {
//             if (err)
//                 res.send(err);
//             res.json(bear);
//         });
//     });
   

    // router.route('/bears')
    // .get(function(req, res) {
    //     Bear.find(function(err, bears) {
    //         if (err)
    //             res.send(err);

    //         res.json(bears);
    //     });
    // });
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

