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
    <div className="App">
      <h1>UUID and QR Code Generator</h1>
      <input type="text" value={uuid} readOnly />
      <br />
      <QRCode value={qrCodeValue} />
      <br />
      <button onClick={generateNewUuid}>Refresh UUID</button>
      <button onClick={sendUuid}>Send UUID</button>
    </div>
  );
}

export default App;