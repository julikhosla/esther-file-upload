import { RouterProvider, createBrowserRouter } from "react-router-dom";

import FileUploadComponent from "./components/FileUploadComponent";
// import ScanPage from "./components/ScanPage";

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			exact: true,
			element: <FileUploadComponent />,
		},
		// {
		// 	path: "/qr_code",
		// 	element: <ScanPage />,
		// },
	]);
	return <RouterProvider router={router} />;
}

export default App;
