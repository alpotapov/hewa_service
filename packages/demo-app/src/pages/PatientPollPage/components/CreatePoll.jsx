import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import pollService from '../../../services/pollService';

function CreatePoll() {
  const [question, setQuestion] = useState('Have you taken your medication today?');
  const [answers, setAnswers] = useState([
    "Yes, I've taken it as prescribed.",
    "I don't have any medication to take today.",
  ]);
  const [from, setFrom] = useState('Mgr. Jakub Pětioký MBA');
  const [frequency, setFrequency] = useState('daily');
  const [uuid, setUuid] = useState(uuidv4());

  const createPollMutation = useMutation(pollService.createPoll, {
    onSuccess: () => {
      setQuestion('');
      setAnswers(['']);
      setFrom('');
      setFrequency('daily');
      setUuid(uuidv4());
    },
  });

  const handleCreatePoll = async () => {
    const poll = {
      question,
      answers: answers.filter((answer) => answer.trim() !== ''),
      from,
      frequency,
    };
    await createPollMutation.mutate(poll);
  };

  React.useEffect(() => {
    console.log({ data: createPollMutation.data });
  }, [createPollMutation.data]);

  const handleAnswerChange = (event, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, '']);
  };

  return (
    <div className="flex flex-col">
      <div className="py-3 text-center">
        <span className="text-2xl font-light">Create Questionnaire</span>
        <div className="mt-4 bg-white shadow-md sm:rounded-lg text-left">
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
              <div className="mb-5">
                <div className="block mb-1">UUID:</div>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  type="text"
                  id="uuid"
                  name="uuid"
                  value={uuid}
                  readOnly
                />
              </div>
              <button
                type="button"
                onClick={handleCreatePoll}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              >
                Create Questionnaire
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePoll;
