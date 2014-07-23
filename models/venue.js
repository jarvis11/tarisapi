var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AddressSchema = require('./address')

var VenueSchema = new Schema({
	name: String,
	//addresses: [{type: Schema.Types.ObjectId, ref: 'Address'}]
	addresses: [AddressSchema.Schema]
});

module.exports = mongoose.model('Venue', VenueSchema);