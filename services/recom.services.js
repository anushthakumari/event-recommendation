const User = require("../schemas/Users.schema");
const Event = require("../schemas/Events.schema");
const EventBooking = require("../schemas/EventBookig.schema");

//build a user-item matrix
const buildUserItemMatrix = (bookings) => {
	const userIds = Array.from(
		new Set(bookings.map((booking) => booking.user_id[0].toString()))
	);
	const eventIds = Array.from(
		new Set(bookings.map((booking) => booking.event_id[0].toString()))
	);

	const userItemMatrix = Array.from({ length: userIds.length }, () =>
		Array.from({ length: eventIds.length }, () => 0)
	);

	for (const booking of bookings) {
		const userIdIndex = userIds.indexOf(booking.user_id[0].toString());
		const eventIdIndex = eventIds.indexOf(booking.event_id[0].toString());
		userItemMatrix[userIdIndex][eventIdIndex] = 1;
	}

	return { userIds, eventIds, userItemMatrix };
};

//Dot product
const dot = (a, b) => a.map((x, i) => x * b[i]).reduce((acc, val) => acc + val);

//Euclidean norm
const norm = (vector) =>
	Math.sqrt(vector.map((x) => x * x).reduce((acc, val) => acc + val));

//perform collaborative filtering
const collaborativeFiltering = (userItemMatrix, targetUserId) => {
	const targetUserIndex = userItemMatrix.userIds.indexOf(targetUserId);
	const targetUserVector = userItemMatrix.userItemMatrix[targetUserIndex];

	const similarityScores = [];
	for (let i = 0; i < userItemMatrix.userIds.length; i++) {
		if (i !== targetUserIndex) {
			const otherUserVector = userItemMatrix.userItemMatrix[i];
			const similarity =
				dot(targetUserVector, otherUserVector) /
				(norm(targetUserVector) * norm(otherUserVector));
			similarityScores.push({ userId: userItemMatrix.userIds[i], similarity });
		}
	}

	similarityScores.sort((a, b) => b.similarity - a.similarity);

	return similarityScores;
};

//get collaborative filtering recommendations based on past bookings
const getCollaborativeFilteringRecommendations = async (
	bookings,
	targetUserId
) => {
	const userItemMatrix = buildUserItemMatrix(bookings);
	const similarUsers = collaborativeFiltering(userItemMatrix, targetUserId);

	if (similarUsers.length === 0) {
		console.log("No similar users found. Fallback to popular events.");

		const popularEvents = await Event.find().populate("event_type_id");
		return popularEvents.map((event) => ({
			eventId: event._id.toString(),
			title: event.title,
			event_date: event.event_date,
			event_type: event.event_type_id[0].title,
			event_time: event.event_time,
			event_place: event.event_place,
		}));
	}

	//Recommend events from the most similar user
	const mostSimilarUser = similarUsers[0];
	const recommendedEvents =
		userItemMatrix.userItemMatrix[
			userItemMatrix.userIds.indexOf(mostSimilarUser.userId)
		];

	const eventDetails = await Promise.all(
		recommendedEvents
			.map((value, index) => ({
				eventId: userItemMatrix.eventIds[index],
				value,
			}))
			.filter((event) => event.value === 1)
			.map(async (event) => {
				const eventDocument = await Event.findById(event.eventId).populate(
					"event_type_id"
				);
				return {
					eventId: event.eventId,
					title: eventDocument.title,
					event_date: eventDocument.event_date,
					event_type: eventDocument.event_type_id[0].title,
					event_time: eventDocument.event_time,
			        event_place: eventDocument.event_place,
				};
			})
	);

	return eventDetails;
};

//get recommendations for a user
const getRecommendations = async (userId) => {
	const user = await User.findById(userId).populate("interests");
	const userInterests = user.interests.map((interest) =>
		interest._id.toString()
	);

	if (userInterests.length > 0) {
		// If user has selected interests, recommend events based on interests
		const eventsBasedOnInterests = await Event.find({
			event_type_id: { $in: userInterests },
		}).populate("event_type_id");

		return eventsBasedOnInterests.map((event) => ({
			eventId: event._id.toString(),
			title: event.title,
			event_date: event.event_date,
			event_type: event.event_type_id[0].title,
			event_time: event.event_time,
			event_place: event.event_place,
		}));
	} else {
		// If user has no selected interests, fall back to collaborative filtering based on past bookings
		const bookings = await EventBooking.find({ user_id: userId }).populate(
			"event_id"
		);

		const recommendations = await getCollaborativeFilteringRecommendations(
			bookings,
			userId
		);
		return recommendations;
	}
};

const runRecommendationSystem = async (targetUserId = "") => {
	const recommendations = await getRecommendations(targetUserId);

	return recommendations;
};

module.exports = {
	runRecommendationSystem,
};
