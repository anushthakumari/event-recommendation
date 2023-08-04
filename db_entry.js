const csv = require("csv-parser");
const fs = require("fs");
const slugify = require("slugify");

const EventTypes = require("./schemas/EventTypes");
const Users = require("./schemas/Users.schema");
const EventBooking = require("./schemas/EventBookig.schema");
const Events = require("./schemas/Events.schema");

const results = [];

module.exports = () => {
	fs.createReadStream("./csvs/event_booking_history.csv")
		.pipe(csv())
		.on("data", (data) => results.push(data))
		.on("end", async () => {
			const dt = [];

			for (const obj of results) {
				// const user_id = await Users.findOne({ name: obj.customer_name });
				const event_type_formatted = slugify(
					obj.event_type.replace("-", " "),
					"_"
				);
				const event_details = await EventTypes.findOne({
					title: event_type_formatted,
				});

				dt.push({
					title: obj.event_name,
					event_date: convertToDateObject(obj.event_date),
					event_type_id: event_details._id,
					event_type: obj.event_type,
					// booking_date: convertToDateObject(obj.booking_date),
					// event_date: obj.event_date
					// 	? convertToDateObject(obj.event_date)
					// 	: null,
					// ticket_price: Number(obj.ticket_price),
					// ticket_id: Number(obj.ticket_id),
					// event_type: undefined,
				});
			}

			await Events.insertMany(dt);

			console.log("done import");
			console.log(dt[0]);
		});
};

function convertToDateObject(dateString) {
	let dateObject;

	if (dateString.includes("/")) {
		// Format: '4/16/2022'
		const [month, day, year] = dateString.split("/");
		dateObject = new Date(`${year}-${month}-${day}`);
	} else if (dateString.includes("-")) {
		// Format: '12-08-2022'
		const [day, month, year] = dateString.split("-");
		dateObject = new Date(`${year}-${month}-${day}`);
	} else {
		throw new Error("Invalid date format");
	}

	return dateObject;
}
