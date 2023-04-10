/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import DataRequestPure from './components/DataRequestPure';
import DayPlot from './components/DayChart';
import RangeEditor from './components/RangeEditor';
import RangeList from './components/RangeList';

function DataRequest() {
  const diagnoses = [
    'Covid Positive',
    'Covid Negative',
    'Diabetes',
    'Hypertension',
    'Asthma',
    'Cancer',
    'Heart Disease',
    'Stroke',
    'Alzheimer',
    'Kidney Disease',
    'Liver Disease',
    'Depression',
    'Anxiety',
    'OCD',
    'Bipolar Disorder',
    'Schizophrenia',
    'PTSD',
    'Eating Disorder',
    'Autism',
    'ADHD',
    'Dementia',
    'Parkinson',
    'Multiple Sclerosis',
    'Arthritis',
    'Chronic Pain',
    'Sleep Disorder',
  ];
  const data = [
    'Ferritin',
    'Cortisol',
    'Hemoglobin A1c',
    'Vitamin D',
    'Blood Pressure',
    'Blood Sugar',
    'Weight',
    'Height',
    'BMI',
    'Pulse',
    'Oxygen Saturation',
  ];
  const onSendRequest = (collected) => {
    console.log({ collected });
  };
  const [ranges, setRanges] = React.useState([]);
  const [selectedRangeId, setSelectedRangeId] = React.useState(null);
  const [selectedRange, setSelectedRange] = React.useState(null);
  const getRange = (id) => ranges.find((range) => range.id === id);
  const onNewRange = ({ start, end }) => {
    setRanges([
      ...ranges,
      { start, end, type: 'measurement', id: Date.now(), metadata: { measurement: [] } },
    ]);
  };
  const onDeleteRange = (id) => {
    setRanges(ranges.filter((range) => range.id !== id));
    if (id === selectedRangeId) {
      setSelectedRangeId(null);
      setSelectedRange(null);
    }
  };
  const onUpdate = (updatedRange) => {
    setRanges(ranges.map((range) => (range.id === updatedRange.id ? updatedRange : range)));
    console.log(ranges.map((range) => (range.id === updatedRange.id ? updatedRange : range)));
  };
  const onSelectRange = (id) => {
    setSelectedRangeId(id);
    setSelectedRange(getRange(id));
  };
  const onRangeTypeChange = (newType, id) => {
    setRanges(
      ranges.map((range) =>
        range.id === id ? { ...range, type: newType, metadata: { [newType]: [] } } : range
      )
    );
  };

  return (
    <div>
      <DayPlot
        days={100}
        ranges={ranges}
        onNewRange={onNewRange}
        onSelectRange={onSelectRange}
        selectedRangeId={selectedRangeId}
        setSelectedRangeId={setSelectedRangeId}
      />
      <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
        <RangeList ranges={ranges} onSelectRange={onSelectRange} />
        {selectedRangeId && (
          <RangeEditor
            ranges={ranges}
            selectedRangeId={selectedRangeId}
            onDelete={onDeleteRange}
            onUpdate={onUpdate}
            onRangeTypeChange={onRangeTypeChange}
            diagnoses={diagnoses}
            measurements={data}
          />
        )}
      </div>
      {/* <div className="ml-4">
        <h3>Ranges</h3>
        <div>
          {ranges.map((range) => (
            <div key={range.id} className="cursor-pointer" onClick={() => onSelectRange(range.id)}>
              <div>
                {range.start} - {range.end}
              </div>
              <div>{range.type}</div>
              <button type="button" onClick={() => onDeleteRange(range.id)}>
                Delete
              </button>
              <div>
                Type:
                <select
                  value={range.type}
                  onChange={(e) => onRangeTypeChange(e.target.value, range.id)}
                >
                  <option value="diagnosis">Diagnosis</option>
                  <option value="measurement">Measurement</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      {/* <DataRequestPure diagnoses={diagnoses} data={data} onSendRequest={onSendRequest} /> */}
    </div>
  );
}

DataRequest.propTypes = {};

export default DataRequest;
