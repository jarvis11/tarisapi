var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdSchema = new Schema({
	
	type: {type: String, required: true},
	time: {type: Date, default: Date.now},
	status: {type: Boolean, default: true},
	bid: {
		bidtype: {type: String, required: true}, 
		amount: {type: Number, default: 5}
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
	
	
});

module.exports = mongoose.model('Ad', AdSchema);
