// ===============================================================================================
// ===============================================================================================
//server.js
// ===============================================================================================
// ===============================================================================================


//BASE SETUP

//Call our packages

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//Config app to use body-parser
app.use(bodyParser());

var port = process.env.PORT || 8080;	//set port

//Config app to use MongoDB through Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/tarisapi_1'); //Connects to our database

//Enable our models
var Venue = require('./models/venue');

var Address = require('./models/address');
var Microlocation = require('./models/microlocation');



//ROUTES FOR API
// ===============================================================================================

var router = express.Router();	//get instance of express router


// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});


// test route (GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the Taris Content API' });
});

//additional routes go here
router.route('/venues')

	//get all Venues with their respective Addresses and Microlocations
	//Accessed at: GET http://localhost:8080/api/venues
	.get(function(req, res){
		Venue.find(function(err, venues){
			if(err)
				res.send(err);
			res.json(venues);
		});
	})

	//Register a venue into Taris
	//Accessed at: POST http://localhost:8080/api/venues)
	.post(function(req,res){

		var venue = new Venue();
		venue.name = req.body.name;

		venue.save(function(err){
			if(err)
				res.send(err);
			res.json({message: 'You have registered a venue!'});
		});
	});


router.route('/venues/:venue_id')

	//Get a venue with specific venue_id :venue_id
	//Accessed at: GET http://localhost:8080/api/venues/:venue_id
	.get(function(req, res) {
		Venue.findById(req.params.venue_id, function(err, venue) {
			if (err)
				res.send(err);
			res.json(venue);
		});
	})

	//Update a venue's credentials
	//Accessed at: PUT http://localhost:8080/api/venues/:venue_id
	.put(function(req, res) {

		//Find the venue we want
		Venue.findById(req.params.venue_id, function(err, venue) {

			if (err)
				res.send(err);

			venue.name = req.body.name; 	

			//save the Venue
			venue.save(function(err) {
				if (err)
					res.send(err);
				res.json({message: 'Venue has been updated.'});
			});

		});
	})

	//Register an address with a venue
	//Accessed at: POST http://localhost:8080/api/venues/:venue_id
	.post(function(req, res) {

		Venue.findById(req.params.venue_id, function(err, venue) {

			if (err)
				res.send(err);

			var address = new Address();
			address.street = req.body.street;
			address.city = req.body.city;
			address.state = req.body.state;
			address.zip = req.body.zip;

			venue.addresses.push(address);

			venue.save(function(err) {
				if (err)
					res.send(err);
				res.json({ message: 'You have added an address to this venue.' });
			});

		});

	});

router.route('/venues/:venue_id/addresses')	
	
	//Find all addresses for a single venue
	//Accessed at: GET http://localhost:8080/api/venues/:venue_id/addresses
	.get(function(req, res) {
		Venue.findById(req.params.venue_id, function(err, venue) {
			if (err)
				res.send(err);
			res.json(venue.addresses);
		});
	})

	//INCLUDE A PUT TO UPDATE AN ADDRESS HERE

	//Alternative route to post an addresses for a venue
	//Accessed at: POST http://localhost:8080/api/venues/:venue_id/addresses
	.post(function(req, res) {

		Venue.findById(req.params.venue_id, function(err, venue) {

			if (err)
				res.send(err);

			var address = new Address();
			address.street = req.body.street;
			address.city = req.body.city;
			address.state = req.body.state;
			address.zip = req.body.zip;

			venue.addresses.push(address);

			venue.save(function(err) {
				if (err)
					res.send(err);
				res.json({ message: 'You have added an address to this venue.' });
			});

		});

	});


router.route('/venues/:venue_id/addresses/:address_id')

	.get(function(req, res) {
		Venue.findById(req.params.venue_id, function(err, venue) {
			if (err)
				res.send(err);
			
				res.json(venue.addresses.id(req.params.address_id));

			});

	});


router.route('/venues/:venue_id/addresses/:address_id/microlocations')
	
	//Get all microlocations within embedded within an address
	//Accessed at: GET http://localhost:8080/api/venues/:venue_id/addresses/:address_id/microlocations
	.get(function(req, res){
		Venue.findById(req.params.venue_id, function(err, venue){
			if(err)
				res.send(err);
			address = venue.addresses.id(req.params.address_id);
			res.json(address.microlocations);

		});
	})


	//Assign a new microlocation to an address
	.post(function(req,res){

		Venue.findById(req.params.venue_id, function(err, venue){
			if(err)
				res.send(err);

			//find the address you want to update
			address = venue.addresses.id(req.params.address_id);

			//create your microlocation
			var microlocation = new Microlocation();
			microlocation.uuid = req.body.uuid;
			microlocation.major_id = req.body.major_id;
			microlocation.minor_id = req.body.minor_id;
			microlocation.descriptor_tag = req.body.descriptor_tag;
			microlocation.action_tag = req.body.action_tag;
			microlocation.price_tag = req.body.price_tag;

			address.microlocations.push(microlocation);

			//save your entire venue object
			venue.save(function(err) {
				if (err)
					res.send(err);
				res.json({ message: 'You have added a microlocation to this address.' });
			});
		});


	});

router.route('/venues/:venue_id/addresses/:address_id/microlocations/:microlocation_id')

	//Get a single microlocation embedded within an address
	//Accessed at: GET http://localhost:8080/api/venues/:venue_id/addresses/:address_id/microlocations/:microlocation_id
	.get(function(req, res){
		//First find your venue
		Venue.findById(req.params.venue_id, function(err, venue){
			if(err)
				res.send(err);

			//Next find your address
			address = venue.addresses.id(req.params.address_id);

			microlocation = address.microlocations.id(req.params.microlocation_id);
			//Return appropriate microlocation

			res.json(microlocation);

		});
	});

router.route('/addresses')

	//get all Addresses in a collection of venues 
	//Accessed at: GET http://localhost:8080/api/addresses
	.get(function(req, res){
		Venue.find(function(err, venues){
			if(err)
				res.send(err);
			for(var i = 0; i < venues.length; i++){
				res.json(venues[i].addresses);
			}

			res.json({message: 'Returned all addresses'});
		});
	});

router.route('/microlocations')

	//get all Microlocations in a collection of venues 
	//Accessed at: GET http://localhost:8080/api/microlocations
	.get(function(req, res){
		Venue.find(function(err, venues){
			if(err)
				res.send(err);

			//var address_array = [];
			var microlocations_array = [];

			//Parse through all venues to find addresses
			for(var i = 0; i < venues.length; i++){
			    var address_array = venues[i].addresses;
			    for (var j = 0; j < address_array.length; j++){

			    	microlocations_array.push(address_array[j].microlocations);
					//res.json(address_array[j].microlocations);
				//Parse through each address object to find microlocations
				// for(var j = 0; j < address_array.length; j++){
				// 	res.json(address_array[j].microlocations);
				// }
				//res.json(venues[i].addresses);
			    }
			}

			res.json(microlocations_array);
		});
	});









//REGISTER OUR ROUTES ----------------------------------------------------------------------------
//all routes prefixed with /api

app.use('/api', router);

//START SERVER
// ===============================================================================================

app.listen(port);
console.log('Welcome to the magical land of Taris, only on port ' + port);
