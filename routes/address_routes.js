var express = require('express');
var router = express.Router();
var Venue = require('../models/venue');

router.route('/addresses')

	//get all Addresses in a collection of venues 
	//Accessed at: GET http://localhost:8080/api/addresses
	.get(function(req, res){
		Venue.find(function(err, venues){
			if(err)
				res.send(err);
			var address_array = [];
			for(var i = 0; i < venues.length; i++){
				address_array.push(venues[i].addresses);
			}

			res.json(address_array);
		});
	});

module.exports = router;
