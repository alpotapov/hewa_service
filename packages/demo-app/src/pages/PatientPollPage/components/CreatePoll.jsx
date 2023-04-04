import React, { useState } from 'react';
import PropTypes from 'prop-types';

function CreatePoll({ onPollCreated }) {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState(['']);
  const [from, setFrom] = useState('');
  const [frequency, setFrequency] = useState('daily');

  const handleCreatePoll = () => {
    const poll = {
      question,
      answers: answers.filter((answer) => answer.trim() !== ''),
      from,
      frequency,
    };
    onPollCreated(poll);
  };

  const handleAnswerChange = (event, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, '']);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 mx-auto text-center w-8/12">
        <span className="text-2xl font-light">Patient Poll</span>
        <div className="relative mt-4 bg-white shadow-md sm:rounded-lg text-left">
          <div className="h-2 bg-indigo-600 rounded-t-md" />
          <div className="py-6 px-8">
            <form>
              <div className="mb-5">
                <div className="block mb-1">Question:</div>
                <input
                  type="text"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-5">
                <div className="block mb-1">Answers:</div>
                {answers.map((answer, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={index} className="w-full">
                    <input
                      type="text"
                      value={answer}
                      onChange={(event) => handleAnswerChange(event, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddAnswer}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Add Answer
                </button>
              </div>
              <div className="mb-5">
                <div className="block mb-1">From:</div>
                <input
                  type="text"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-5">
                <div className="block mb-1">Frequency:</div>
                <select
                  value={frequency}
                  onChange={(event) => setFrequency(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleCreatePoll}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              >
                Create Poll
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

CreatePoll.propTypes = {
  onPollCreated: PropTypes.func.isRequired,
};

export default CreatePoll;
