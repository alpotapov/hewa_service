import React from 'react';
import PropTypes from 'prop-types';

function RangeList({ ranges, onSelectRange }) {
  return (
    <div className="grow md:max-w-xs bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Ranges</h2>

      <ul className="space-y-3">
        {ranges.map((range) => (
          <button
            className="p-0 text-left w-full"
            key={range.id}
            type="button"
            onClick={() => onSelectRange(range.id)}
          >
            <li className="border p-3 rounded-md shadow-sm">
              <div className="font-medium text-sm mb-2">
                {range.type === 'diagnosis' ? 'Diagnosis' : 'Measurement'} Range
              </div>
              <div className="text-sm">
                <p>Start Day: {range.start}</p>
                <p>End Day: {range.end}</p>
                {range.metadata.diagnosis && (
                  <p>Diagnoses: {range.metadata.diagnosis.join(', ')}</p>
                )}
                {range.metadata.measurement && (
                  <p>Measurements: {range.metadata.measurement.join(', ')}</p>
                )}
              </div>
            </li>
          </button>
        ))}
        <button className="p-0 text-left w-full" type="button" onClick={() => {}}>
          <li className="border p-3 rounded-md shadow-sm">
            <div className="font-medium text-sm">+ New Range</div>
          </li>
        </button>
      </ul>
    </div>
  );
}

RangeList.propTypes = {
  ranges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
      metadata: PropTypes.shape({
        diagnosis: PropTypes.arrayOf(PropTypes.string),
        measurements: PropTypes.arrayOf(PropTypes.string),
      }),
    })
  ).isRequired,
  onSelectRange: PropTypes.func.isRequired,
};

export default RangeList;
