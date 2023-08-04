const express = require("express");

const db = require("./db");
const eventsController = require("./controllers/events.controllers");

const app = express();

// app.use("/", (req, rs) => {
// 	rs.end();
// });
app.use("/recommend", eventsController.find_event_bookings);

// Start the server
const port = 3000; // You can change this to any port you prefer

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

process.on("SIGINT", () => {
	db.close(() => {
		console.log(
			"Disconnected from the database due to application termination"
		);
		process.exit(0);
	});
});
