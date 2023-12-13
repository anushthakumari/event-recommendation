import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

export default axios;

export const getRecommendedEventsById = async (user_id, pageNumber = 1) => {
	const { data } = await axios.get("/recommend", {
		params: {
			id: user_id,
			page: pageNumber,
		},
	});
	return data;
};

export const loginAPI = async (username, password) => {
	const { data } = await axios.post("/login", {
		username,
		password,
	});

	return data;
};
