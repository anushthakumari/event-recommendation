import { createBrowserRouter } from "react-router-dom";

//user
import Login from "./pages/Login";
import UserHome from "./pages/Home";

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
		path: "/home",
		element: <UserHome />,
	},
]);

export default router;
