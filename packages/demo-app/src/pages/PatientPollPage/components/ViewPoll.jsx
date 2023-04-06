import React from 'react';
import ViewPollPure from './ViewPollPure';

function ParentComponent() {
  const questionnaire = {
    answers: ["Yes, I've taken it as prescribed.", "I don't have any medication to take today."],
    frequency: 'daily',
    from: 'Mgr. Jakub Pětioký MBA',
    question: 'Have you taken your medication today?',
    uuid: 'd1b3499c-ad1b-4949-9fbe-8af066b90be4',
  };

  return <ViewPollPure questionnaire={questionnaire} />;
}

export default ParentComponent;
