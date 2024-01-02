import { createBrowserRouter } from "react-router-dom";

//user
import Login from "./pages/Login";
import UserHome from "./pages/Home";
import Register from "./pages/Register.jsx";
import SelectInterest from "./pages/SelectInterest";
const router = createBrowserRouter([
	{
		path: "/",
		element: <Login />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
		path: "/home",
		element: <UserHome />,
	},
	{
		path: "/select-interest",
		element: <SelectInterest />,
	},
]);

export default router;
