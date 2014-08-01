var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AdSchema = require('./ad')

var CampaignSchema = new Schema({

	name: String,
	time: {type: Date, default: Date.now},
	status: {type: Boolean, default: true},
	type: {type: String, required: true},
	budget: {type: Number, required: true},
	ads: [AdSchema.schema]


});

module.exports = mongoose.model('Campaign', CampaignSchema);