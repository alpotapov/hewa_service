import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode.react';
import axios from 'axios';

// const SERVER_URL = 'https://api.healthdrive.tech/api/v1';
const SERVER_URL = 'http://localhost:3011/api/v1';

const getRandomArrayElement = (array) => Math.floor(Math.random() * array.length);

const getRandom = () => {
  const testTypes = ['Vitamin D', 'Ferritin'];
  const uuid = uuidv4();
  const testType = testTypes[getRandomArrayElement(testTypes)];
  const testValue = (Math.random() * 150).toFixed(2);
  const qrCodeValue = JSON.stringify({
    uuid,
    testType,
  });
  return {
    uuid,
    testType,
    testValue,
    qrCodeValue,
  };
};

function App() {
  const [uuid, setUuid] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [testType, setTestType] = useState('');
  const [testValue, setTestValue] = useState('');

  const regenerateRandomValues = () => {
    const {
      uuid: newUuid,
      testType: newTestype,
      testValue: newTestValue,
      qrCodeValue: newQrCodeValue,
    } = getRandom();
    setTestType(newTestype);
    setTestValue(newTestValue);
    setUuid(newUuid);
    setQrCodeValue(newQrCodeValue);
  };

  const sendUuid = async () => {
    try {
      const { data } = await axios.post(`${SERVER_URL}/demo`, { uuid, testType, testValue });
      console.log(data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    regenerateRandomValues();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl mx-auto text-center">
        <span className="text-2xl font-light">HealthDrive App</span>
        <div className="relative mt-4 bg-white shadow-md sm:rounded-lg text-left">
          <div className="h-2 bg-indigo-600 rounded-t-md" />
          <div className="py-6 px-8">
            <h1 className="text-lg font-semibold">Step 1: Scan QR Code</h1>
            <p className="mt-4">
              Scan the QR code with the HealthDrive app and add a new entry into your wallet.
            </p>
            <div className="mt-4">
              <QRCode value={qrCodeValue} />
            </div>
            <button
              type="button"
              onClick={regenerateRandomValues}
              className="mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Refresh UUID
            </button>
            <h1 className="mt-8 text-lg font-semibold">Step 2: Send UUID</h1>
            <div htmlFor="testType" className="mt-4 block text-sm font-medium text-gray-700">
              Test Type
            </div>
            <select
              id="testType"
              value={testType}
              readOnly
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none text-base text-gray-700"
            >
              <option>Vitamin D</option>
              <option>Ferritin</option>
            </select>
            <div htmlFor="testValue" className="mt-4 block text-sm font-medium text-gray-700">
              Value
            </div>
            <input
              type="text"
              id="testValue"
              value={testValue}
              readOnly
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none text-base text-gray-700"
            />
            <button
              type="button"
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
