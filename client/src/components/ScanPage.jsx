// ScanPage.js
import { Box, Center } from "@chakra-ui/react";
import jsQR from "jsqr";
import QRCode from "qrcode";
import React, { useRef, useState } from "react";

const ScanPage = () => {
	const [decodedQRCode, setQRCodeData] = useState("");
	const qrCodeCanvasRef = useRef(null);

	const fileInputRef = useRef(null);
	const generateAndSaveQRCode = async () => {
		try {
			const canvas = qrCodeCanvasRef.current;
			const redirectUrl = "https://estherandwesley.netlify.app/";

			await QRCode.toCanvas(canvas, redirectUrl);
			// Convert canvas to image and save
			const image = canvas
				.toDataURL("image/png")
				.replace("image/png", "image/octet-stream");
			const link = document.createElement("a");
			link.download = "Wedding_upload_pic.png";
			link.href = image;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Error generating QR code:", error);
		}
	};
	const handleScanQRCode = async () => {
		const file = fileInputRef.current.files[0];

		if (!file) {
			alert("Please select a file.");
			return;
		}

		try {
			const reader = new FileReader();
			// Read the file as data URL
			reader.onload = async (event) => {
				const arrayBuffer = event.target.result;

				const decodedQRCode = jsQR(
					new Uint8ClampedArray(arrayBuffer),
					file.width,
					file.height,
				);

				if (decodedQRCode) {
					setQRCodeData(decodedQRCode.data);
				} else {
					alert("No QR code found in the uploaded image.");
				}
			};
			reader.readAsArrayBuffer(file);
		} catch (error) {
			console.error("Error decoding QR code:", error);
			alert("Error decoding QR code. Please try again.");
		}
	};
	return (
		<Center h="100vh">
			<Box>
				<input
					type="text"
					value={decodedQRCode}
					onChange={(e) => setQRCodeData(e.target.value)}
					placeholder="Enter QR code data"
				/>
				<button onClick={generateAndSaveQRCode}>Generate QR Code</button>
				<canvas ref={qrCodeCanvasRef} style={{ display: "none" }} />

				<input type="file" accept="image/*" ref={fileInputRef} />
				<button onClick={handleScanQRCode}>Scan QR Code</button>
			</Box>
		</Center>
	);
};

export default ScanPage;
