import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import UploadPage from "./components/FileUpload";
import ScanPage from "./components/ScanPage";
import FileUploadComponent from "./components/FileUploadComponent";

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			exact: true,
			element: <FileUploadComponent />,
		},
		{
			path: "/upload/:qrData",
			element: <UploadPage />,
		},
	]);
	return <RouterProvider router={router} />;
}

export default App;
