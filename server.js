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
//var Venue = require('./models/venue');
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
router.route('/addresses')

	//Create a venue (accessed at POST http://localhost:8080/api/addresses)
	.post(function(req, res) {

		//var venue = new Venue();
		var address = new Address();
		var microlocation = new Microlocation();
		//venue.name = req.body.name;
		//venue.addresses.push()
		address.street = req.body.street;
		address.city = req.body.city;
		address.state = req.body.state;
		address.zip = req.body.zip;
		
		// microlocation.uuid = req.body.uuid;
		// microlocation.major_id = req.body.major_id;
		// microlocation.minor_id = req.body.minor_id;
		// microlocation.descriptor_tag = req.body.descriptor_tag;
		// microlocation.action_tag = req.body.action_tag;
		// microlocation.price_tag = req.body.price_tag;


		// address.microlocations.push(microlocation);

		address.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Address created!' });
		});


	})

		// get all Addresses with their respective Microlocations (accessed at GET http://localhost:8080/api/addresses)
	.get(function(req, res) {
		Address.find(function(err, addresses) {
			if (err)
				res.send(err);

			res.json(addresses);
		});
	});


router.route('/addresses/:address_id')

	//Post a new microlocation
	.post(function(req, res) {

		Address.findById(req.params.address_id, function(err, address) {

			if (err)
				res.send(err);

			var microlocation_new = new Microlocation();
			microlocation_new.uuid = req.body.uuid;
			microlocation_new.major_id = req.body.major_id;
			microlocation_new.minor_id = req.body.minor_id;
			microlocation_new.descriptor_tag = req.body.descriptor_tag;
			microlocation_new.action_tag = req.body.action_tag;
			microlocation_new.price_tag = req.body.price_tag;
			address.microlocations.push(microlocation_new);

			address.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Microlocation created!' });
			});

		});

	})


	//get address with ObjectID id (GET http://localhost/api/addresses/:address_id)
	.get(function(req, res) {
		Address.findById(req.params.address_id, function(err, address) {
			if (err)
				res.send(err);
			res.json(address);
		});
	})

	//update address with ObjectID id (PUT http://localhost/api/addresses/:address_id)
	.put(function(req, res) {

		// use our address model to find the address we want
		Address.findById(req.params.address_id, function(err, address) {

			if (err)
				res.send(err);

			address.street = req.body.street; 	// update the Addresses info
			address.city = req.body.city;
			address.state = req.body.state;
			address.zip = req.body.zip;


			// save the Address
			address.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Address updated!' });
			});

		});
	});




//REGISTER OUR ROUTES ----------------------------------------------------------------------------
//all routes prefixed with /api

app.use('/api', router);

//START SERVER
// ===============================================================================================

app.listen(port);
console.log('Welcome to the magical land of Taris, only on port ' + port);
