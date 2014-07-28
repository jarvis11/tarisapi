//initialize Express router
var express = require('express');
var router = express.Router();

//import necessary models
var Campaign = require('../models/campaign_document/campaign');
var Ad = require('../models/campaign_document/ad');
// var Bid = require('../models/campaign_document/bid');
// var Target = require('../models/campaign_document/target');


// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Dealing with Campaigns.');
	next(); // make sure we go to the next routes and don't stop here
});

/*=============================================================================================

ROUTES GO HERE

=============================================================================================*/

//high level campaign routes (GET, POST)
router.route('/campaigns')

	//get all campaigns in an account
	//Accessed at: GET http://localhost:8080/api/campaigns
	.get(function(req, res){
		Campaign.find(function(err, campaigns){
			if(err)
				res.send(err);
			console.log('getting all campaigns');
			res.json(campaigns);
		});
	})

	//Add a new campaign to an account
	//Accessed at: POST http://localhost:8080/api/campaigns)
	.post(function(req,res){

		var campaign = new Campaign();
		campaign.name = req.body.name;
		campaign.type = req.body.type;
		campaign.budget = req.body.budget;

		//save our new campaign
		campaign.save(function(err){
			if(err)
				res.send(err);
			console.log('adding a new campaign');
			res.json({message: 'You have created a campaign!'});
		});
	});


//specific campaign routes (GET, PUT)
router.route('/campaigns/:campaign_id')

	//Get a campaign with id :campaign_id
	//Accessed at: GET http://localhost:8080/api/campaigns/:campaign_id
	.get(function(req, res) {
		Campaign.findById(req.params.campaign_id, function(err, campaign) {
			if (err)
				res.send(err);
			console.log('getting a specific campaign');
			res.json(campaign);
		});
	})

	//Update a campaign's attributes
	//Accessed at: PUT http://localhost:8080/api/campaigns/:campaign_id
	.put(function(req, res) {

		//Find the campaign we want
		Campaign.findById(req.params.campaign_id, function(err, campaign) {

			if (err)
				res.send(err);


			//TYPE IS NOT EDITABLE
			campaign.name = req.body.name; 	
			campaign.budget = req.body.budget;

			//save the Campaign
			campaign.save(function(err) {
				if (err)
					res.send(err);
				console.log('updating a specific campaign');
				res.json({message: 'Campaign has been updated.'});
			});

		});
	});

router.route('/campaigns/:campaign_id/ads')	
	
	//Find all ads for a single campaign
	//Accessed at: GET http://localhost:8080/api/campaigns/:campaign_id/ads
	.get(function(req, res) {
		Campaign.findById(req.params.campaign_id, function(err, campaign) {
			if (err)
				res.send(err);
			console.log('getting a campaigns ads');
			res.json(campaign.ads);
		});
	})



	//Add an ad to a campaign
	//Accessed at: POST http://localhost:8080/api/campaigns/:campaign_id/ads
	.post(function(req, res) {

		Campaign.findById(req.params.campaign_id, function(err, campaign) {

			if (err)
				res.send(err);

			var ad = new Ad();
			ad.type = req.body.type;
			ad.bid.bidtype = req.body.bidtype;
			ad.bid.amount = req.body.amount;
			ad.target.venue_name = req.body.venue_name;
			ad.target.venue_city = req.body.venue_city;
			ad.target.venue_street = req.body.venue_street;
			ad.target.venue_zip = req.body.venue_zip;
			ad.target.microlocation_descriptor_tag = req.body.microlocation_descriptor_tag;
			ad.target.microlocation_action_tag = req.body.microlocation_action_tag;
			ad.target.microlocation_price_tag = req.body.microlocation_price_tag;


			campaign.ads.push(ad);

			campaign.save(function(err) {
				if (err)
					res.send(err);

				console.log('adding an ad to a campaign');
				res.json({ message: 'You have added an ad to this campaign.' });
			});

		});

	});


router.route('/campaigns/:campaign_id/ads/:ad_id')
	//Find a specific ad belonging to a specific campaign
	//Accessed at: GET http://localhost:8080/api/campaigns/:campaign_id/ads/:ad_id
	.get(function(req, res) {
		Campaign.findById(req.params.campaign_id, function(err, campaign) {
			if (err)
				res.send(err);
			
			console.log('getting a specific ad');
			res.json(campaign.ads.id(req.params.ad_id));

		});

	});

	// //Update an address
	// //Accessed at: PUT http://localhost:8080/api/venues/:venue_id/addresses/:address_id
	// //ISSUE: RIGHT NOW NEED TO UPDATE THE ENTIRE ADDRESS. CANNOT JUST UPDATE SIGNAL ENTITIES. NEED TO FIX THIS.
	// .put(function(req, res){

	// 	//Find the venue we want
	// 	Venue.findById(req.params.venue_id, function(err, venue) {
	// 		if(err)
	// 			res.send(err);

	// 		address = venue.addresses.id(req.params.address_id);
	// 		address.street = req.body.street;
	// 		address.city = req.body.city;
	// 		address.state = req.body.state;
	// 		address.zip = req.body.zip;

	// 		venue.save(function(err){
	// 			if (err)
	// 				res.send(err);

	// 			console.log('updating address');
	// 			res.json({message: "Address has been updated"});
	// 		});
	// 	});
	// });



module.exports = router;