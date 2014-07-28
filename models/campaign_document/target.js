var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TargetSchema = new Schema({
	
	venue_name: String,
	venue_street: String,
	venue_city: String,
	venue_state: String,
	venue_zip: Number,
	microlocation_descriptor_tag: [String],
	microlocation_action_tag: [String],
	microlocation_price_tag: [String]
});

module.exports = mongoose.model('Target', TargetSchema);