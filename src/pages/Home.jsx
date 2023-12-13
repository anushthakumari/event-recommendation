import React, { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";

import Layout from "../layouts/Layout";

import useAuth from "../hooks/useAuth";
import { getRecommendedEventsById } from "../apis";

const ProjectList = () => {
	const [loading, setloading] = useState(false);
	const [data, setdata] = useState([]);
	const [paginationObj, setpaginationObj] = useState({});
	const user = useAuth();

	const getEvents = useCallback(
		(pageNumber) => {
			setloading(true);
			getRecommendedEventsById(user?._id, pageNumber)
				.then((data) => {
					setdata(data.data);
					setpaginationObj(data.pagination);
				})
				.catch((e) => console.log(e))
				.finally((e) => {
					setloading(false);
				});
		},
		[user?._id]
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
				<div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
					<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
						<div className="flex justify-between rounded-t mb-0 px-4 py-3 border-0">
							<div className="flex flex-wrap items-center">
								<div className="relative w-full px-4 max-w-full flex-grow flex-1">
									<h3 className="font-semibold text-base text-blueGray-700">
										Recommended Events
									</h3>
								</div>
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
											Event Date
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
												{formatDateFromDatabase(v.event_date)}
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	return (
		<div className="flex justify-center my-4">
			<nav className="flex">
				{/* Previous Page Button */}
				<button
					className="px-3 py-2 bg-gray-200 rounded-l-md focus:outline-none"
					disabled={currentPage === 1}
					onClick={() => onPageChange(currentPage - 1)}>
					Previous
				</button>

				{/* Page Numbers */}
				{[...Array(totalPages).keys()].map((pageNumber) => (
					<button
						key={pageNumber + 1}
						className={`px-3 py-2 mx-1 bg-blue-500 text-white rounded-md focus:outline-none ${
							currentPage === pageNumber + 1 ? "bg-gray-700" : ""
						}`}
						onClick={() => onPageChange(pageNumber + 1)}>
						{pageNumber + 1}
					</button>
				))}

				{/* Next Page Button */}
				<button
					className="px-3 py-2 bg-gray-200 rounded-r-md focus:outline-none"
					disabled={currentPage === totalPages}
					onClick={() => onPageChange(currentPage + 1)}>
					Next
				</button>
			</nav>
		</div>
	);
};

function formatDateFromDatabase(dateString) {
	try {
		const date = new Date(dateString);

		// Options for formatting the date
		const options = { year: "numeric", month: "long", day: "numeric" };

		// Format the date using toLocaleDateString
		const formattedDate = date.toLocaleDateString("en-US", options);

		return formattedDate;
	} catch (error) {
		console.error("Error formatting date:", error);
		return null;
	}
}
