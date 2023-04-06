import React from 'react';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';

function ViewPollPure({ questionnaire }) {
  const { uuid, question, answers, from, frequency } = questionnaire;

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto pb-8">
        <div className="w-full text-2xl font-light text-center">Questionnaire</div>
        <div className="w-full text-md font-light text-center text-gray-500">{uuid}</div>
        <div className="h-2 bg-indigo-600 rounded-t-md mt-2" />
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row">
          <div className="md:w-1/2 p-4 border-r-0 md:border-r-2 border-gray-300">
            <div className="text-center">
              <div className="flex flex-col md:flex-row justify-between md:justify-around items-center">
                <QRCode value={uuid} size={256} />
              </div>
              <p className="mt-4 text-lg text-gray-600">
                Please scan the QR code using your HealthDrive app.
              </p>
            </div>
          </div>
          <div className="md:w-1/2 p-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{question}</h2>
            <ul className="mb-4 list-disc pl-4 text-gray-700">
              {answers.map((answer, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>{answer}</li>
              ))}
            </ul>
            <p className="text-gray-600">
              <strong className="text-gray-800">From:</strong> {from}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Frequency:</strong> {frequency}
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Scan QR code and add this questionnaire to your HealthDrive. You agree to receive{' '}
              {frequency} reminders to answer the questions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

ViewPollPure.propTypes = {
  questionnaire: PropTypes.shape({
    answers: PropTypes.arrayOf(PropTypes.string),
    uuid: PropTypes.string,
    question: PropTypes.string,
    from: PropTypes.string,
    frequency: PropTypes.string,
  }).isRequired,
};

export default ViewPollPure;
