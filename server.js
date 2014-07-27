// ===============================================================================================
// ===============================================================================================
//server.js
// ===============================================================================================
// ===============================================================================================


// BASE SETUP
// ===============================================================================================

//Call our packages
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//Config app to use body-parser
app.use(bodyParser());

//Set port
var port = process.env.PORT || 8080;

//Config app to use MongoDB through Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/tarisapi_1'); //Connects to our database

//Enable our models
var Venue = require('./models/venue');
var Address = require('./models/address');
var Microlocation = require('./models/microlocation');

//Enable our routes
var venue_routes = require('./routes/venue_routes');
var address_routes = require('./routes/address_routes');
var microlocation_routes = require('./routes/microlocation_routes');



// REGISTER ROUTES
// ===============================================================================================

//all routes prefixed with /api
app.use('/api', venue_routes);
app.use('/api', address_routes);
app.use('/api', microlocation_routes);

// START SERVER
// ===============================================================================================

app.listen(port);
console.log('Welcome to the magical land of Taris, only on port ' + port);
