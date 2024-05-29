import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Content from "./components/Content";
// import ScanPage from "./components/ScanPage";

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			exact: true,
			element: <Content />,
		},
		// {
		// 	path: "/qr_code",
		// 	element: <ScanPage />,
		// },
	]);
	return <RouterProvider router={router} />;
}

export default App;
