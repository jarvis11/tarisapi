var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AddressSchema = require('./address')

var VenueSchema = new Schema({

	name: String,
	addresses: [AddressSchema.schema]
});

module.exports = mongoose.model('Venue', VenueSchema);