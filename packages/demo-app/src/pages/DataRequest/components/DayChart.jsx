/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, LineChart, XAxis, YAxis, ReferenceArea, Label } from 'recharts';

function DayPlot({ days }) {
  const daysToPlot = React.useMemo(
    () => Array.from({ length: days }, (_, i) => ({ day: i })),
    [days]
  );
  const [ranges, setRanges] = useState([]);
  const [activeRangeIndex, setActiveRangeIndex] = useState(null);
  const [rangeType, setRangeType] = useState('diagnosis');
  const rangeStart = React.useRef(null);
  const [rangeCurrentEnd, setRangeCurrentEnd] = React.useState(null);
  const chartRef = React.useRef(null);

  const deleteRange = (id) => {
    setRanges(ranges.filter((range) => range.id !== id));
  };

  const getYValue = (chartHeight, chartY) => {
    const domainMin = 0;
    const domainMax = ranges.length + 1;
    const inverseChartY = chartHeight - chartY;
    console.log({ chartHeight, chartY, domainMin, domainMax, inverseChartY });
    return ((domainMax - domainMin) * inverseChartY) / chartHeight;
  };

  const isInsideRange = (x, y) =>
    ranges.some(
      (range, index) => x >= range.start && x <= range.end && y >= index && y <= index + 1
    );

  const onMouseDown = (e) => {
    console.log('mouse down', e);
    if (!e) return;
    if (e.activeLabel) {
      const xValue = e.activeLabel;
      const chartHeight = chartRef.current?.container.clientHeight;
      const yValue = getYValue(chartHeight, e.chartY);
      console.log({ xValue, yValue });
      if (!isInsideRange(xValue, yValue)) {
        rangeStart.current = e.activeLabel;
      }
    }
  };

  const createRange = (start, end, type) => {
    console.log('creating range');
    setRanges([...ranges, { start, end, type, id: Date.now() }]);
    rangeStart.current = null;
    setRangeCurrentEnd(null);
  };

  const onMouseUp = (e) => {
    console.log('mouse up', e);
    if (!e) {
      createRange(rangeStart.current, rangeCurrentEnd, rangeType);
      return;
    }
    if (!!rangeStart.current && e.activeLabel) {
      createRange(rangeStart.current, e.activeLabel, rangeType);
    }
  };

  const onMouseMove = (e) => {
    if (!e) return;
    if (e.activeLabel) {
      setRangeCurrentEnd(e.activeLabel);
    }
  };

  const onSelectChange = (e) => {
    const newType = e.target.value;
    setRangeType(newType);
    setRanges(
      ranges.map((range) => (range.id === activeRangeIndex ? { ...range, type: newType } : range))
    );
  };

  const getColor = (type) => {
    switch (type) {
      case 'diagnosis':
        return 'rgba(255, 99, 132, 0.3)';
      case 'measurement':
        return 'rgba(54, 162, 235, 0.3)';
      default:
        return 'rgba(0, 0, 0, 0.3)';
    }
  };

  React.useEffect(() => {
    console.log(ranges);
  }, [ranges]);

  return (
    <div className="flex">
      <div className="w-full h-96">
        <ResponsiveContainer>
          <LineChart
            ref={chartRef}
            data={daysToPlot}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          >
            <XAxis dataKey="day" />
            <YAxis domain={[0, ranges.length + 1]} />
            {rangeStart.current && (
              <ReferenceArea
                key="new-range"
                x1={rangeStart.current}
                x2={rangeCurrentEnd}
                y1={ranges.length}
                y2={ranges.length + 1}
                fill="green"
                fillOpacity={0.3}
              />
            )}
            {ranges.map((range, index) => (
              <ReferenceArea
                key={range.id}
                x1={range.start}
                x2={range.end}
                y1={index}
                y2={index + 1}
                fill={getColor(range.type)}
                fillOpacity={0.3}
                onClick={() => setActiveRangeIndex(range.id)}
              >
                <Label
                  value={`Start: ${range.start}`}
                  position="insideTopLeft"
                  fill="#000"
                  fontSize={12}
                />
                <Label
                  value={`End: ${range.end}`}
                  position="insideBottomRight"
                  fill="#000"
                  fontSize={12}
                />
              </ReferenceArea>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {activeRangeIndex !== null && (
        <div className="ml-4">
          <h3>Range Settings</h3>
          <div>
            Type:
            <select value={rangeType} onChange={onSelectChange}>
              <option value="diagnosis">Diagnosis</option>
              <option value="measurement">Measurement</option>
            </select>
          </div>
        </div>
      )}
      <div className="ml-4">
        <h3>Ranges</h3>
        <div>
          {ranges.map((range) => (
            <div
              key={range.id}
              className="cursor-pointer"
              onClick={() => setActiveRangeIndex(range.id)}
            >
              <div>
                {range.start} - {range.end}
              </div>
              <div>{range.type}</div>
              <button type="button" onClick={() => deleteRange(range.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

DayPlot.propTypes = {
  days: PropTypes.number.isRequired,
};

export default DayPlot;
