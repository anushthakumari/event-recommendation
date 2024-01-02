const Users = require("../schemas/Users.schema");
const EventTypes = require("../schemas/EventTypes");
const { runRecommendationSystem } = require("../services/recom.services");

module.exports.find_event_bookings = async (req, res) => {
  const userId = req.query.id; //new mongoose.Types.ObjectId(req.query.id);
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10

  try {
    const recom_events = await runRecommendationSystem(userId);

    // const dt = await EventBookings.find({ user_id: userId });

    // let recom_events = [];

    // for (const row of dt) {
    // 	const d = await Events.find(
    // 		{ event_type_id: row.event_id },
    // 		{ title: 1, event_date: 1, event_type_id: 1 }
    // 	).populate("event_type_id", { _id: 1, title: 1, __v: -1 });

    // 	recom_events.push(...d);
    // }

    // Apply pagination to recom_events array
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const paginatedEvents = recom_events.slice(startIdx, endIdx);

    res.send({
      data: paginatedEvents,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(recom_events.length / pageSize),
        totalCount: recom_events.length,
      },
    });
  } catch (error) {
    console.error("Error retrieving event bookings:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await Users.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = password === user.password;

    // Check if the passwords match
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }


    res.send(user);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.register = async (req, res) => {
  const { username, password, fullname } = req.body;
  try {
    // Find the user by username
    const user = await Users.findOne({ username });

    // Check if the user exists
    if (user) {
      return res
        .status(401)
        .json({ message: "User with this username already exists!" });
    }

    const newUser = new Users({
      username,
      password,
      name: fullname,
    });

    await newUser.save();

    res.send(newUser);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.get_event_types = async (req, res) => {
  try {
    const events = await EventTypes.find();
    res.send(events);
  } catch (e) {
    console.error("Error geting events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.set_interest = async (req, res) =>{
  try{
    const userId = req.params.id;
    const body = req.body;

    await Users.updateOne({ _id: userId }, {
      interests : body
    }) 

    res.send({message: "Successfully Updated."})
  }catch(e){
    console.log("Error while saving data: ", e)
    res.status(500).json({ message: "Internal Server Error" });
  }
}
