//initialize Express router
var express = require('express');
var router = express.Router();

//import necessary models
var Venue = require('../models/venue_document/venue');
var Address = require('../models/venue_document/address');
var Microlocation = require('../models/venue_document/microlocation');

// // middleware to use for all requests
// router.use(function(req, res, next) {
// 	// do logging
// 	console.log('Dealing with Venues.');
// 	next(); // make sure we go to the next routes and don't stop here
// });

/*=============================================================================================

ROUTES GO HERE

=============================================================================================*/

//high level venue routes (GET, POST)
router.route('/venues')

	//get all Venues with their respective Addresses and Microlocations
	//Accessed at: GET http://localhost:8080/api/venues
	.get(function(req, res){
		Venue.find(function(err, venues){
			if(err)
				res.send(err);
			console.log('getting all venues');
			res.json(venues);
		});
	})

	//Register a venue with Taris
	//Accessed at: POST http://localhost:8080/api/venues)
	.post(function(req,res){

		var venue = new Venue();
		//Input variables needed to create venue
		venue.name = req.body.name;

		venue.save(function(err){
			if(err){
				res.send(err);
				res.json({message: 'Error. Check your parameters.'});
			} else{
				console.log('adding a new venue');
				res.json({message: 'You have registered a venue!'});
			}
			
		});
	});

//specific venue routes (GET, PUT)
router.route('/venues/:venue_id')

	//Get a venue with specific venue_id :venue_id
	//Accessed at: GET http://localhost:8080/api/venues/:venue_id
	.get(function(req, res) {
		Venue.findById(req.params.venue_id, function(err, venue) {
			if (err)
				res.send(err);
			console.log('getting a specific venue');
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
				console.log('updating a specific venue');
				res.json({message: 'Venue has been updated.'});
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
			console.log('getting a venues addresses');
			res.json(venue.addresses);
		});
	})



	//Add an address for a venue
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

				console.log('adding an address to a venue');
				res.json({ message: 'You have added an address to this venue.' });
			});

		});

	});


router.route('/venues/:venue_id/addresses/:address_id')
	//Find a specific address belonging to a specific venue
	//Accessed at: GET http://localhost:8080/api/venues/:venue_id/addresses/:address_id
	.get(function(req, res) {
		Venue.findById(req.params.venue_id, function(err, venue) {
			if (err)
				res.send(err);
			
			console.log('getting a specific address');
			res.json(venue.addresses.id(req.params.address_id));

		});

	})

	//Update an address
	//Accessed at: PUT http://localhost:8080/api/venues/:venue_id/addresses/:address_id
	//ISSUE: RIGHT NOW NEED TO UPDATE THE ENTIRE ADDRESS. CANNOT JUST UPDATE SIGNAL ENTITIES. NEED TO FIX THIS.
	.put(function(req, res){

		//Find the venue we want
		Venue.findById(req.params.venue_id, function(err, venue) {
			if(err)
				res.send(err);

			address = venue.addresses.id(req.params.address_id);
			address.street = req.body.street;
			address.city = req.body.city;
			address.state = req.body.state;
			address.zip = req.body.zip;

			venue.save(function(err){
				if (err)
					res.send(err);

				console.log('updating address');
				res.json({message: "Address has been updated"});
			});
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

			console.log('getting all microlocations for address');
			res.json(address.microlocations);

		});
	})


	//Assign a new microlocation to an address
	//Accessed at: POST http://localhost:8080/api/venues/:venue_id/addresses/:address_id/microlocations
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

				console.log('adding microlocation');
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

			console.log('getting a one microlocation');
			res.json(microlocation);

		});
	})

	//Update an microlocation
	//Accessed at: PUT http://localhost:8080/api/venues/:venue_id/addresses/:address_id/microlocations/:microlocation_id
	//ISSUE: RIGHT NOW NEED TO UPDATE THE ENTIRE MICROLOCATION. CANNOT JUST UPDATE SIGNAL ENTITIES. NEED TO FIX THIS.
	.put(function(req, res){

		//Find the venue we want
		Venue.findById(req.params.venue_id, function(err, venue) {
			if(err)
				res.send(err);

			address = venue.addresses.id(req.params.address_id);
			microlocation = address.microlocations.id(req.params.microlocation_id)

			microlocation.uuid = req.body.uuid;
			microlocation.major_id = req.body.major_id;
			microlocation.minor_id = req.body.minor_id;
			microlocation.descriptor_tag = req.body.descriptor_tag;
			microlocation.action_tag = req.body.action_tag;
			microlocation.price_tag = req.body.price_tag;

			venue.save(function(err){
				if (err)
					res.send(err);

				console.log('updating microlocation');
				res.json({message: "Microlocation has been updated!"});
			});
		});
	});


module.exports = router;