/**TARIS API README**/

CURRENTLY REGISTERED ROUTES:

GET http://localhost:8080/api/venues				Get all venues

POST http://localhost:8080/api/venues				Create a new venue

GET http://localhost:8080/api/venues/:venue_id		Get a venue with a specific id :venue_id

PUT http://localhost:8080/api/venues/:venue_id		Update venue with id :venue_id

GET http://localhost:8080/api/venues/:venue_id/addresses		Get all addresses for venue with id :venue_id

POST http://localhost:8080/api/venues/:venue_id/addresses		Create an address for venue with id :venue_id

GET http://localhost:8080/api/venues/:venue_id/addresses/:address_id		Get a specific address with id :address_id belongong to a specific venue with id :venue_id

GET http://localhost:8080/api/venues/:venue_id/addresses/:address_id/microlocations		Get all microlocations belonging to a specific address with id :address_id that belongs to a specific venue with id :venue_id

POST http://localhost:8080/api/venues/:venue_id/addresses/:address_id/microlocations	Add a new microlocation to the stack of an address with id :address_id and venue with id :venue_id

GET http://localhost:8080/api/venues/:venue_id/addresses/:address_id/microlocations/:microlocation_id	Get a single microlocation with id :microlocation_id belonging to address with id :address_id belonging to venue with id :venue_id

GET http://localhost:8080/api/addresses 			get all addresses in the system

GET http://localhost:8080/api/microlocations		get all microlocations in the system

