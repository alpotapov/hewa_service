import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode.react";
import axios from "axios";

function App() {
  const [uuid, setUuid] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");

  useEffect(() => {
    generateNewUuid();
  }, []);

  const generateNewUuid = () => {
    const newUuid = uuidv4();
    setUuid(newUuid);
    setQrCodeValue(newUuid);
  };

  const sendUuid = async () => {
    try {
      await axios.post("%SERVER_URL%", { uuid });
      alert("UUID sent successfully");
    } catch (error) {
      alert("Failed to send UUID");
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl mx-auto text-center">
        <span className="text-2xl font-light">HealthDrive App</span>
        <div className="relative mt-4 bg-white shadow-md sm:rounded-lg text-left">
          <div className="h-2 bg-indigo-600 rounded-t-md"></div>
          <div className="py-6 px-8">
            <h1 className="text-lg font-semibold">Step 1: Scan QR Code</h1>
            <p className="mt-4">Scan the QR code with the HealthDrive app and add a new entry into your wallet.</p>
            <div className="mt-4">
              <QRCode value={qrCodeValue} />
            </div>
            <button
              onClick={generateNewUuid}
              className="mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Refresh UUID
            </button>
            <h1 className="mt-8 text-lg font-semibold">Step 2: Send UUID</h1>
            <p className="mt-4">Simulate sending result notification by pressing the "Send UUID" button.</p>
            <button
              onClick={sendUuid}
              className="mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Send UUID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;