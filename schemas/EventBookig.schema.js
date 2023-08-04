const mongoose = require("mongoose");

const Users = require("./Users.schema");
const EventTypes = require("./EventTypes");

const EventBookigSchema = new mongoose.Schema({
	name: String,
	user_id: [
		{ type: mongoose.Schema.Types.ObjectId, ref: Users.collection.name },
	],
	ticket_id: {
		type: Number,
		unique: true,
	},
	event_name: String,
	event_date: Date,
	venue_name: String,
	seat_numner: String,
	ticket_price: mongoose.Schema.Types.Number,
	payment_method: String,
	booking_date: Date,
	booking_status: String,
	event_id: [
		{ type: mongoose.Schema.Types.ObjectId, ref: EventTypes.collection.name },
	],
});

const EventBookig = mongoose.model("event_booking", EventBookigSchema);

module.exports = EventBookig;
