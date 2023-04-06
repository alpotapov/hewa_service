import React from 'react';
import PropTypes from 'prop-types';

function ResponsesTable({ responses }) {
  return (
    <div className="max-w-full">
      <table className="table-auto w-full max-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Response UUID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
              Time Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
              Response
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {responses.map((poll, index) =>
            poll.responses.map((response, responseIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={`${index}-${responseIndex}`}>
                {responseIndex === 0 && (
                  <td
                    rowSpan={poll.responses.length}
                    className="px-6 py-4 text-sm text-gray-900 break-word"
                  >
                    {poll.responseUuid}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 break-all">
                  {new Date(response.timeCreated).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 break-word">{response.response}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

ResponsesTable.propTypes = {
  responses: PropTypes.arrayOf().isRequired,
};

export default ResponsesTable;
