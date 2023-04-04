import React, { useState } from 'react';
import CreatePoll from './components/CreatePoll';
import ViewPolls from './components/ViewPolls';

function PatientPollPage() {
  const [polls, setPolls] = useState([]);

  const handlePollCreated = (poll) => {
    setPolls([...polls, poll]);
  };

  return (
    <div className="">
      <CreatePoll onPollCreated={handlePollCreated} />
      <ViewPolls polls={polls} />
    </div>
  );
}

export default PatientPollPage;
