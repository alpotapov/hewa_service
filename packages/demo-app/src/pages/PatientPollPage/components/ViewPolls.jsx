import React from 'react';
import { useQuery } from 'react-query';
import pollService from '../../../services/pollService';

function ViewPolls() {
  const { data: polls = [] } = useQuery('polls', pollService.getPolls);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-5">Created Polls</h2>
      <ul>
        {polls.map((poll, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index} className="mb-3">
            <h3 className="text-lg font-semibold">{poll.question}</h3>
            <p>From: {poll.from}</p>
            <p>Frequency: {poll.frequency}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

ViewPolls.propTypes = {};

export default ViewPolls;
