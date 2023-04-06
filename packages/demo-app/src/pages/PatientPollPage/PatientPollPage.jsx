import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import CreatePoll from './components/CreatePoll';
import ViewPolls from './components/ViewPolls';

function PatientPollPage() {
  return (
    <div className="container mx-auto px-4 mt-5">
      <h1 className="text-2xl font-bold mb-5">Patient Poll</h1>
      <nav className="mb-5">
        <ul className="flex space-x-4">
          <li>
            <Link className="text-blue-500" to="view">
              View Polls
            </Link>
          </li>
          <li>
            <Link className="text-blue-500" to="create">
              Create Poll
            </Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="view" element={<ViewPolls />} />
        <Route path="create" element={<CreatePoll />} />
        <Route index element={<ViewPolls />} />
      </Routes>
    </div>
  );
}

export default PatientPollPage;
