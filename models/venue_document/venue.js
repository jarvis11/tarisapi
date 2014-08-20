var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AddressSchema = require('./address')

var VenueSchema = new Schema({

	name: {type: String, required: true},
	addresses: [AddressSchema.schema]
});

module.exports = mongoose.model('Venue', VenueSchema);