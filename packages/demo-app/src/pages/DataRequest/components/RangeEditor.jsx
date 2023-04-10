/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import FilterableList from './FilterableList';
import EventFrequency from './EventFrequency';

function RangeEditor({
  ranges,
  selectedRangeId,
  onDelete,
  onUpdate,
  onRangeTypeChange,
  diagnoses,
  measurements,
}) {
  const selectedRange = ranges.find((range) => range.id === selectedRangeId);
  const handleTypeChange = (e) => {
    onRangeTypeChange(e.target.value, selectedRange.id);
  };

  const handleStartChange = (e) => {
    const updatedRange = { ...selectedRange, start: Number(e.target.value) };
    onUpdate(updatedRange);
  };

  const handleEndChange = (e) => {
    const updatedRange = { ...selectedRange, end: Number(e.target.value) };
    onUpdate(updatedRange);
  };

  const handleMaxMinutesChange = (minutes) => {
    const updatedRange = { ...selectedRange, maxMinutes: Number(minutes) };
    onUpdate(updatedRange);
  };

  const handleMetadataChange = (updatedMetadata) => {
    const updatedRange = { ...selectedRange, metadata: { [selectedRange.type]: updatedMetadata } };
    onUpdate(updatedRange);
  };

  return (
    <div className="grow bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Range Editor</h2>

      <div className="mb-4">
        <div className="block text-sm font-medium text-gray-700">Range Type</div>
        <select
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={selectedRange.type}
          onChange={handleTypeChange}
        >
          <option value="diagnosis">Diagnosis</option>
          <option value="measurement">Measurement</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="block text-sm font-medium text-gray-700">Start Day</div>
          <input
            type="number"
            value={selectedRange.start}
            onChange={handleStartChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700">End Day</div>
          <input
            type="number"
            value={selectedRange.end}
            onChange={handleEndChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {selectedRange.type === 'measurement' && (
        <div className="my-4 bg-white p-4 rounded-md shadow-md">
          <div className="block mb-2 text-sm font-medium text-gray-700">Measurement frequency</div>
          <EventFrequency selectedRange={selectedRange} onChange={handleMaxMinutesChange} />
        </div>
      )}

      {selectedRange.type === 'measurement' && (
        <div className="my-4 bg-white p-4 rounded-md shadow-md">
          <div className="block mb-1 text-sm font-medium text-gray-700">Type of measurement</div>
          <FilterableList
            items={measurements}
            selectedItems={selectedRange.metadata.measurement}
            setSelectedItems={handleMetadataChange}
            searchPlaceholder="Filter measurements..."
          />
        </div>
      )}
      {selectedRange.type === 'diagnosis' && (
        <div className="my-4 bg-white p-4 rounded-md shadow-md">
          <div className="block mb-1 text-sm font-medium text-gray-700">Type of diagnosis</div>
          <FilterableList
            items={diagnoses}
            selectedItems={selectedRange.metadata.diagnosis}
            setSelectedItems={handleMetadataChange}
            searchPlaceholder="Filter diagnosis..."
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => onDelete(selectedRange.id)}
        className="mt-4 w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Delete Range
      </button>
    </div>
  );
}

RangeEditor.propTypes = {
  selectedRangeId: PropTypes.number.isRequired,
  ranges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
      metadata: PropTypes.shape({}).isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRangeTypeChange: PropTypes.func.isRequired,
  diagnoses: PropTypes.arrayOf(PropTypes.string).isRequired,
  measurements: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RangeEditor;
