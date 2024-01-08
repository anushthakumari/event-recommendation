import axios from "axios";

import * as loginUtils from "./utils/login.utils";

axios.defaults.baseURL = "http://localhost:5000";

export default axios;

export const getRecommendedEventsById = async (
	user_id,
	pageNumber = 1,
	type
) => {
	const { data } = await axios.get("/recommend", {
		params: {
			id: user_id,
			page: pageNumber,
			type,
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
export const registerAPI = async (username, password, fullname) => {
	const { data } = await axios.post("/register", {
		username,
		password,
		fullname,
	});

	return data;
};

export const getEventTypesAPI = async () => {
	const { data } = await axios.get("/event-types");

	return data;
};

export const setIntrestAPI = async (eventTypeIds = []) => {
	const user = loginUtils.getUser();

	await axios.put("/" + user._id + "/interest", eventTypeIds);
};
