import React, { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";

import Layout from "../layouts/Layout";
import Pagination from "./Pagination";

import useAuth from "../hooks/useAuth";
import { getRecommendedEventsById } from "../apis";

const ProjectList = () => {
	const [loading, setloading] = useState(false);
	const [data, setdata] = useState([]);
	const [paginationObj, setpaginationObj] = useState({});
	const [selectedType, setSelectedType] = useState("collaborative");

	const handleChange = (event) => {
		setSelectedType(event.target.value);
	};

	const user = useAuth();

	const getEvents = useCallback(
		(pageNumber) => {
			setloading(true);
			getRecommendedEventsById(user?._id, pageNumber, selectedType)
				.then((data) => {
					setdata(data.data);
					setpaginationObj(data.pagination);
				})
				.catch((e) => console.log(e))
				.finally((e) => {
					setloading(false);
				});
		},
		[user?._id, selectedType]
	);

	useEffect(() => {
		getEvents();
	}, [getEvents]);

	if (!user) {
		return <Navigate to={"/login"} />;
	}

	return (
		<Layout>
			<section className="bg-blueGray-50">
				<div className="w-full mb-12 xl:mb-0 px-4 mx-auto mt-24">
					<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
						<div className="flex justify-between rounded-t mb-0 px-4 py-3 border-0">
							<div className="flex flex-wrap items-center">
								<div className="relative w-full px-4 max-w-full flex-grow flex-1">
									<h3 className="font-semibold text-base text-blueGray-700">
										Recommended Events
									</h3>
								</div>
							</div>
							<div>
								<RecommendationTypeRadioGroup
									handleChange={handleChange}
									selectedType={selectedType}
								/>
							</div>
						</div>

						<div className="block w-full overflow-x-auto">
							{loading ? (
								<h1 className="px-4 text-center text-lg">Loading...</h1>
							) : (
								""
							)}
							<table className="items-center bg-transparent w-full border-collapse ">
								<thead>
									<tr>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											Title
										</th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											Type
										</th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											Place
										</th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											Date & Time
										</th>
									</tr>
								</thead>

								<tbody>
									{!data.length ? (
										<tr>
											<td colSpan={5}>
												<center className="text-lg">No Data Found!</center>
											</td>
										</tr>
									) : (
										""
									)}
									{data.map((v) => (
										<tr key={v.project_id}>
											<td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
												{v.title}
											</td>
											<td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
												{v.event_type.replaceAll("_", " ")}
											</td>
											<td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
												{v.event_place}
											</td>
											<td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
												{formatDateFromDatabase(v.event_date) +
													" " +
													v.event_time}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<div>
								<Pagination
									currentPage={paginationObj.currentPage}
									totalPages={paginationObj.totalPages}
									onPageChange={getEvents}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	);
};

export default ProjectList;

function formatDateFromDatabase(dateString) {
	try {
		const date = new Date(dateString);

		const options = { year: "numeric", month: "long", day: "numeric" };

		const formattedDate = date.toLocaleDateString("en-US", options);

		return formattedDate;
	} catch (error) {
		console.error("Error formatting date:", error);
		return null;
	}
}

function RecommendationTypeRadioGroup({ selectedType, handleChange }) {
	return (
		<div className="flex items-center space-x-4">
			<label htmlFor="collaborative">
				<input
					type="radio"
					id="collaborative"
					name="recommendationType"
					value="collaborative"
					checked={selectedType === "collaborative"}
					onChange={handleChange}
				/>
				Collaborative Based Recommendation
			</label>
			<label htmlFor="content">
				<input
					type="radio"
					id="content"
					name="recommendationType"
					value="content"
					checked={selectedType === "content"}
					onChange={handleChange}
				/>
				Content Based Recommendation
			</label>
		</div>
	);
}
