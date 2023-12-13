const express = require("express");
const cors = require("cors");

const db = require("./db");
const eventsController = require("./controllers/events.controllers");

const app = express();

// app.use("/", (req, rs) => {
// 	rs.end();
// });
app.use(cors());
app.use(express.json());
app.use("/recommend", eventsController.find_event_bookings);
app.post("/login", eventsController.login);

// Start the server
const port = 5000; // You can change this to any port you prefer

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
