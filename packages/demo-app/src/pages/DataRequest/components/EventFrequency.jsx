import React, { useState } from 'react';
import PropTypes from 'prop-types';

const predefinedOptions = {
  hourly: 60,
  daily: 24 * 60,
  weekly: 7 * 24 * 60,
  monthly: 30 * 24 * 60,
};

function EventFrequency({ selectedRange, onChange }) {
  const [frequency, setFrequency] = useState();

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
    if (e.target.value === 'custom') return;
    onChange(predefinedOptions[e.target.value]);
  };

  const handleCustomChange = (e) => {
    setFrequency('custom');
    onChange(e.target.value);
  };

  return (
    <>
      <form>
        <div className="flex flex-row space-x-4">
          {Object.entries(predefinedOptions).map(([key, minutes]) => (
            <div key={key}>
              <input
                type="radio"
                id={`frequency-${key}`}
                name="frequency"
                value={key}
                checked={selectedRange.maxMinutes === minutes}
                onChange={handleFrequencyChange}
                className="mr-2"
              />
              <label htmlFor={`frequency-${key}`} className="text-sm">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center">
          <input
            type="radio"
            id="frequency-custom"
            name="frequency"
            value="custom"
            checked={frequency === 'custom'}
            onChange={handleFrequencyChange}
            className="mr-2"
          />
          <div className="text-sm mr-2">Custom</div>
          <input
            type="number"
            min="1"
            value={selectedRange.maxMinutes}
            onChange={handleCustomChange}
            disabled={frequency !== 'custom'}
            className="text-sm w-24 p-1 border rounded-md"
          />
          <span className="text-sm ml-1">minutes</span>
        </div>
      </form>
      <div className="mt-4">
        <p className="text-sm">
          Maximum period between measurements:{' '}
          {selectedRange.maxMinutes && `${selectedRange.maxMinutes} minutes`}
        </p>
      </div>
    </>
  );
}

EventFrequency.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectedRange: PropTypes.shape({
    maxMinutes: PropTypes.number,
  }).isRequired,
};

export default EventFrequency;
