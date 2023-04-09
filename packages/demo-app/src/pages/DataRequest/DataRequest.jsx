/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import DataRequestPure from './components/DataRequestPure';
import DayPlot from './components/DayChart';

function DataRequest() {
  const diagnoses = [
    'Covid',
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
  const onNewRange = ({ start, end }) => {
    setRanges([...ranges, { start, end, type: 'measurement', id: Date.now() }]);
  };
  const onDeleteRange = (id) => {
    setRanges(ranges.filter((range) => range.id !== id));
  };
  const onSelectRange = (id) => {
    setSelectedRangeId(id);
  };
  const onRangeTypeChange = (newType, id) => {
    setRanges(ranges.map((range) => (range.id === id ? { ...range, type: newType } : range)));
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
      <div className="ml-4">
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
      </div>
      <DataRequestPure diagnoses={diagnoses} data={data} onSendRequest={onSendRequest} />
    </div>
  );
}

DataRequest.propTypes = {};

export default DataRequest;
