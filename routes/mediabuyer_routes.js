//initialize Express router
var express = require('express');
var router = express.Router();

//import necessary models
var Mediabuyer = require('../models/mediabuyer_document/mediabuyer');
var Campaign = require('../models/campaign_document/campaign');
var Ad = require('../models/campaign_document/ad');




/*=============================================================================================

ROUTES GO HERE

=============================================================================================*/

//high level mediabuyer routes (GET, POST)
router.route('/mediabuyers')

	//Query all mediabuyers
	//Accessed at: GET http://localhost:8080/api/mediabuyers
	.get(function(req, res){

		//find array of all media buyers
		Mediabuyer.find(function(err, mediabuyers){
			if(err)
				res.send(err);
			console.log('getting all mediabuyers');

			//return array of mediabuyers
			res.json(mediabuyers);
		});
	})

	//Add a new mediabuyer to an account
	//Accessed at: POST http://localhost:8080/api/mediabuyers
	.post(function(req,res){

		//create a new media buyer
		var mediabuyer = new Mediabuyer();
		mediabuyer.name = req.body.name;

		//save our new mediabuyer
		mediabuyer.save(function(err){

			//ensure parameters are valid
			if(err){
				console.log('error saving mediabuyer -- invalid parameters');
				res.send(err);
			} else{
				console.log('adding a new mediabuyer');
				res.json({message: 'You have created a mediabuyer!'});

			}
			
		});
	});


//routes for specific mediabuyer (GET, PUT)
router.route('/mediabuyers/:mediabuyer_id')

	//Get a mediabuyer with id :mediabuyer_id
	//Accessed at: GET http://localhost:8080/api/mediabuyers/:mediabuyer_id
	.get(function(req, res) {
		Mediabuyer.findById(req.params.mediabuyer_id, function(err, mediabuyer) {

			//ensure id is valid
			if (err){
				console.log('error getting mediabuyer -- invalid id');
				res.send(err);
			} else{
				console.log('getting mediabuyer with id ' + req.params.mediabuyer_id);
				res.json(mediabuyer);
			}
			
		});
	})

	//Update a mediabuyer's core attributes
	//Accessed at: PUT http://localhost:8080/api/mediabuyers/:mediabuyer_id
	.put(function(req, res) {

		//Find the mediabuyer we want
		Mediabuyer.findById(req.params.mediabuyer_id, function(err, mediabuyer) {

			//ensure mediabuyer id is valid
			if (err){
				console.log('error getting mediabuyer -- invalid id');
				res.send(err);
			} else {

				//update mediabuyer attributes
				mediabuyer.name = req.body.name; 

				//save the Mediabuyer
				mediabuyer.save(function(err) {

					//ensure parameters are valid
					if (err){
						res.send(err);
					} else {
						console.log('updating a specific mediabuyer');
						res.json({message: 'Mediabuyer has been updated.'});
					} // close mediabuyer SAVE error check
				});

			} // close mediabuyer GET error check

		});
	});

//routes for finding campaigns associated with a specific mediabuyer (GET, POST)
router.route('/mediabuyers/:mediabuyer_id/campaigns')	
	
	//Find all campaigns belonging to a mediabuyer
	//Accessed at: GET http://localhost:8080/mediabuyers/:mediabuyer_id/campaigns
	.get(function(req, res) {

		//populate the campaigns attribute of our mediabuyer object using the campaigns collection
		Mediabuyer.findById(req.params.mediabuyer_id).populate('campaigns').exec(function(err, mediabuyer){

			//ensure mediabuyer id is valid
			if(err){
				console.log('error getting mediabuyer -- invalid id');
				res.send(err);

			} else{
				//return an array of populated campaigns
				console.log('getting all campaigns belonging to mediabuyer ' + req.params.mediabuyer_id);
				res.json(mediabuyer.campaigns);
			} 
			
		});
	})


	//Add a campaign to a mediabuyers account
	//Accessed at: POST http://localhost:8080/api/mediabuyers/:mediabuyer_id/campaigns
	.post(function(req, res) {

		Mediabuyer.findById(req.params.mediabuyer_id, function(err, mediabuyer) {

			//ensure mediabuyer id is valid
			if (err){
				console.log('error getting mediabuyer -- invalid id');
				res.send(err);
			} else{

				//create a new campaign
				var campaign = new Campaign();
				campaign.name = req.body.name;
				campaign.type = req.body.type;
				campaign.budget = req.body.budget;

				//validate your campaign
				campaign.save(function(err){

					//ensure campaign parameters are valid
					if(err){
						res.send(err);
					}
					else{
						//if campaign has been validated push it to mediabuyer
						mediabuyer.campaigns.push(campaign);

						//save mediabuyer object
						mediabuyer.save(function(err){
							if(err)
								res.send(err);
							res.json({message: 'You have added a campaign to this mediabuyer'});

						});

					} //close campaign parameter error check

				});

			} //close mediabuyer GET error check

		});

	});


//routes associated with single campaign objects (GET, PUT)
router.route('/mediabuyers/:mediabuyer_id/campaigns/:campaign_id')

	.get(function(req, res){

		//Find mediabuyer with id :mediabuyer_id
		//Populate its campaigns attr with a single campaign with id :campaign_id
		Mediabuyer.findById(req.params.mediabuyer_id).populate({
			
			path: 'campaigns', 
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){

			//ensure a mediabuyer entity exists
			if(err){
				res.send(err);
				console.log("error -- invalid campaign or mediabuyer id");
			} else{

				var campaign = mediabuyer.campaigns[0];

				//ensure campaign has been created
				if(campaign == undefined){
					console.log('ERROR');
					res.json({message: 'error -- invalid campaign id'});

				} else{

					//return campaign
					res.json(campaign);
				}


			} 
			
		});
	})

	.put(function(req, res){

		//Find mediabuyer with id :mediabuyer_id
		//Populate its campaigns attr with a single campaign with id :campaign_id
		Mediabuyer.findById(req.params.mediabuyer_id).populate({
			
			path: 'campaigns', 
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){

			//ensure mediabuyer exists
			if(err){
				console.log("invalid mediabuyer or campaign id");
				res.send(err);
			} else{

				//Grab single campaign object
				campaign = mediabuyer.campaigns[0];

				//ensure object is valid
				if(campaign == undefined){
					console.log('ERROR');
					res.json({message: 'error -- invalid campaign id'});
				} else{

					//TYPE IS NOT EDITABLE -- MAKE NOTE IN API
					campaign.name = req.body.name; 	
					campaign.budget = req.body.budget;
					campaign.status = req.body.status;

					//because mediabuyer has already pushed campaign, we only need to save the campaign in question!
					campaign.save(function(err) {

						//ensure valid parameters
						if (err){
							res.send(err);
						} else{

							console.log('updating a specific campaign');
							res.json({message: 'Campaign has been updated.'});

						}
						
					});

				}

			}

		});

	});


//routes associated with ads belonging to a campaign
router.route('/mediabuyers/:mediabuyer_id/campaigns/:campaign_id/ads')

	.get(function(req, res){

		Mediabuyer.findById(req.params.mediabuyer_id).populate({
			
			path: 'campaigns', 
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){

			//ensure mediabuyer exists
			if(err){
				console.log("invalid mediabuyer or campaign id");
				res.send(err);
			} else{

				//return campaign with specific id
				console.log('getting campaign with id ' + req.params.campaign_id);

				//grab campaign object
				campaign = mediabuyer.campaigns[0];

				//ensure object exists
				if(campaign == undefined){
					console.log('ERROR');
					res.json({message: 'error -- invalid campaign id'});
				} else{
					//return ads
					console.log('returning all ads for campaign with id ' + req.params.campaign_id);
					res.json(campaign.ads);
				}				

			}
			
		});
	})


	.post(function(req, res){

		//Find the mediabuyer
		Mediabuyer.findById(req.params.mediabuyer_id).populate({

			path: 'campaigns',
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){

			if(err){
				console.log("invalid mediabuyer or campaign id");
				res.send(err);
			} else{

				//find campaign
				campaign = mediabuyer.campaigns[0];

				//make sure campaign exists
				if(campaign == undefined){
					console.log('error -- undefined campaign');
					res.json({message: 'error -- invalid campaign id'});
				} else{

					//create a new ad
					var ad = new Ad();
					ad.type = req.body.type;

					//set bidding values
					//DEFAULT BID AMOUNT IS 5 -- NOTE IN API DOCS
					ad.bid.bidtype = req.body.bidtype;
					ad.bid.amount = req.body.amount;

					//set targeting spec
					ad.target.venue_name = req.body.venue_name;
					ad.target.venue_city = req.body.venue_city;
					ad.target.venue_street = req.body.venue_street;
					ad.target.venue_zip = req.body.venue_zip;
					ad.target.microlocation_descriptor_tag = req.body.microlocation_descriptor_tag;
					ad.target.microlocation_action_tag = req.body.microlocation_action_tag;
					ad.target.microlocation_price_tag = req.body.microlocation_price_tag;

					//push our ad
					campaign.ads.push(ad);

					//because mediabuyer has already pushed campaign, we only need to save the campaign in question!

					campaign.save(function(err) {
						if (err){
							res.send(err);
							console.log('error creating ad');
						} else {

							console.log('adding a new ad to this campaign');
							res.json({message: 'Added a new ad to this campaign.'});
						}
						
					});


				}

			}

			
		});
	});




router.route('/mediabuyers/:mediabuyer_id/campaigns/:campaign_id/ads/:ad_id')

	.get(function(req, res){

		//Find desired mediabuyer, populating only campaign with id :campaign_id
		Mediabuyer.findById(req.params.mediabuyer_id).populate({
			
			path: 'campaigns', 
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){

			//THIS IF IS NOT NEEDED AS THE POPULATION ONLY PERTAINS TO CAMPAIGNS
			if(err){
				res.send(err);
				console.log("Not a valid mediabuyer, campaign, or ad id");
			} else {

				//store our campaign
				campaign = mediabuyer.campaigns[0];
				if (campaign == undefined){
					console.log('error -- undefined campaign');
					res.json({message: 'error -- invalid campaign id'});
				} else{

					//WORTH ADDING AN ERROR CHECK FOR AN AD HERE?

					//return campaign with specific id
					console.log('getting ad with id ' + req.params.ad_id);
					res.json(campaign.ads.id(req.params.ad_id));

				}

			}
				
		});
	})


.put(function(req, res){

		//Find desired mediabuyer, populating only campaign with id :campaign_id
		Mediabuyer.findById(req.params.mediabuyer_id).populate({
			
			path: 'campaigns', 
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){
			
			if(err){
				res.send(err);
				console.log("Not a valid mediabuyer, campaign, or ad id");
			} else{

				//grab our campaign
				campaign = mediabuyer.campaigns[0];

				//check campaign validity
				if(campaign == undefined){
					console.log('error -- undefined campaign');
					res.json({message: 'error -- invalid campaign id'});
				} else{

					ad = campaign.ads.id(req.params.ad_id);

					//check ad validity
					if(ad == undefined){
						console.log('error -- undefined ad');
						res.json({message: 'error -- invalid ad id'});
					} else{

						//change your ad status if desired
						ad.status = req.body.status;
						//set bidding values
						ad.bid.bidtype = req.body.bidtype;
						ad.bid.amount = req.body.amount;
						//set targeting spec
						ad.target.venue_name = req.body.venue_name;
						ad.target.venue_city = req.body.venue_city;
						ad.target.venue_street = req.body.venue_street;
						ad.target.venue_zip = req.body.venue_zip;
						ad.target.microlocation_descriptor_tag = req.body.microlocation_descriptor_tag;
						ad.target.microlocation_action_tag = req.body.microlocation_action_tag;
						ad.target.microlocation_price_tag = req.body.microlocation_price_tag;

						//save campaign object
						campaign.save(function(err){

							if (err) {
								res.send(err);
								console.log('error updating ad');
							}
							else {
								console.log('updating advertisement');
								res.json({message: "Ad has been updated"});
							}
							
						});


					}

					


				}

				

			}

		});

	});



module.exports = router;