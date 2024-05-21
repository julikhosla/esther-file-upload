import React, { useState } from "react";
import QRCode from "qrcode.react";

const QRCodeGenerator = () => {
	const [uniqueId, setUniqueId] = useState("");

	const generateUniqueId = () => {
		// Generate unique identifier logic goes here
		const id = Math.random().toString(36).substring(7);
		setUniqueId(id);
	};

	return (
		<div>
			<button onClick={generateUniqueId}>Generate QR Code</button>
			{uniqueId && <QRCode value={uniqueId} />}
		</div>
	);
};

export default QRCodeGenerator;
