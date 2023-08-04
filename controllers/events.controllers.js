const mongoose = require("mongoose")

const EventBookings = require("../schemas/EventBookig.schema");
const Events = require("../schemas/Events.schema");

module.exports.find_event_bookings = async (req, res) => {
	const dt = await EventBookings.find({ user_id: new mongoose.Types.ObjectId(req.query.id) });

	let recom_events = [];

	for (const row of dt) {
		const d = await Events.find(
			{ event_type_id: row.event_id },
			{ title: 1, event_date: 1, event_type_id: 1 }
		).populate("event_type_id", { _id: 1, title: 1, __v: -1 });

		recom_events.push(...d);
	}

	res.send(recom_events);
};
