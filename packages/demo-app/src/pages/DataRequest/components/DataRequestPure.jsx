import React from 'react';
import PropTypes from 'prop-types';

import FilterableList from './FilterableList';

function DataRequestPure({ diagnoses, data, onSendRequest }) {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [sampleSize, setSampleSize] = React.useState(0);
  const [selectedDiagnoses, setSelectedDiagnoses] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState([]);
  const [displayText, setDisplayText] = React.useState('');

  const onDiagnosesChange = (updatedSelectedDiagnoses) => {
    // if (e.target.checked) {
    //   setSelectedDiagnoses([...selectedDiagnoses, diagnosis]);
    // } else {
    //   setSelectedDiagnoses(selectedDiagnoses.filter((d) => d !== diagnosis));
    // }
    setSelectedDiagnoses(updatedSelectedDiagnoses);
  };

  const onDataChange = (e, dataItem) => {
    if (e.target.checked) {
      setSelectedData([...selectedData, dataItem]);
    } else {
      setSelectedData(selectedData.filter((d) => d !== dataItem));
    }
  };

  const sendRequest = () => {
    onSendRequest({
      startDate,
      endDate,
      sampleSize,
      selectedDiagnoses,
      selectedData,
    });
  };

  React.useEffect(() => {
    const diagnosesText =
      selectedDiagnoses.length > 0
        ? ` that were diagnosed with ${selectedDiagnoses.join(', ')}`
        : '';
    const dataText = selectedData.join(', ');
    const userText = sampleSize === 1 ? 'user' : 'users';
    setDisplayText(
      `Requesting ${sampleSize} HealthDrive ${userText}${diagnosesText} to provide ${dataText} data`
    );
  }, [sampleSize, selectedDiagnoses, selectedData]);

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="flex flex-wrap mb-4">
        <div className="w-full md:w-1/2 px-2 mb-2">
          Start Date:
          <input
            className="w-full px-3 py-2 border rounded"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-2">
          End Date:
          <input
            className="w-full px-3 py-2 border rounded"
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4 px-2">
        Sample Size:
        <input
          className="w-full px-3 py-2 border rounded"
          type="number"
          value={sampleSize}
          onChange={(e) => setSampleSize(parseInt(e.target.value, 10))}
        />
      </div>
      <div className="mb-4">
        <h3 className="font-bold mb-2">Diagnoses</h3>
        <FilterableList
          items={diagnoses}
          onSelectionChange={onDiagnosesChange}
          searchPlaceholder="Filter diagnoses..."
        />
      </div>
      <div className="mb-4">
        <h3 className="font-bold mb-2">Data</h3>
        {data.map((dataItem) => (
          <div key={dataItem} className="mb-1">
            <input type="checkbox" id={dataItem} onChange={(e) => onDataChange(e, dataItem)} />
            <label htmlFor={dataItem} className="ml-2">
              {dataItem}
            </label>
          </div>
        ))}
      </div>
      <p className="mb-4 text-sm text-gray-600">{displayText}</p>
      <button
        type="button"
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded"
        onClick={sendRequest}
      >
        Send request for information
      </button>
    </div>
  );
}

DataRequestPure.propTypes = {
  diagnoses: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSendRequest: PropTypes.func.isRequired,
};

export default DataRequestPure;
