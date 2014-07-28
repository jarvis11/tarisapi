var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var TargetSchema = require('./target');
//var BidSchema = require('./bid');

var AdSchema = new Schema({
	
	type: String,
	time: {type: Date, default: Date.now},
	bid: {
		bidtype: String, 
		amount: Number
	},
	target: {
		venue_name: String,
		venue_street: String,
		venue_city: String,
		venue_state: String,
		venue_zip: Number,
		microlocation_descriptor_tag: [String],
		microlocation_action_tag: [String],
		microlocation_price_tag: [String]
	}
	//bid: BidSchema.schema,
	//target: TargetSchema.schema
	
});

module.exports = mongoose.model('Ad', AdSchema);
