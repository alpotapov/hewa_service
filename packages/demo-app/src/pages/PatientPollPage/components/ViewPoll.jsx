import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import ViewPollPure from './ViewPollPure';
import ResponsesTable from './ResponseTable';

function ParentComponent() {
  const questionnaire = {
    answers: ["Yes, I've taken it as prescribed.", "I don't have any medication to take today."],
    frequency: 'daily',
    from: 'Mgr. Jakub Pětioký MBA',
    question: 'Have you taken your medication today?',
    uuid: 'd1b3499c-ad1b-4949-9fbe-8af066b90be4',
  };

  const mockResponses = [
    {
      question: 'Have you taken your medication today?',
      responseUuid: uuidv4(),
      responses: [
        {
          timeCreated: '2023-04-01T12:00:00.000Z',
          response: "Yes, I've taken it as prescribed.",
        },
        {
          timeCreated: '2023-04-02T12:00:00.000Z',
          response: "I don't have any medication to take today.",
        },
      ],
    },
  ];

  return (
    <div className="pb-8">
      <ViewPollPure questionnaire={questionnaire} />
      <ResponsesTable responses={mockResponses} />
    </div>
  );
}

export default ParentComponent;
