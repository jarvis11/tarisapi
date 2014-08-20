var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CampaignSchema = require('../campaign_document/campaign');

var MediabuyerSchema = new Schema({

	name: {type: String, required: true},
	campaigns: [{type: Schema.Types.ObjectId, ref: 'Campaign'}]
});

module.exports = mongoose.model('Mediabuyer', MediabuyerSchema);