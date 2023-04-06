import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreatePoll from './components/CreatePoll';
import ViewPolls from './components/ViewPolls';
import ViewPoll from './components/ViewPoll';

import { useSubnavigation } from '../../contexts/SubnavigationContext';

function PatientPollPage() {
  const { setSubnavigation } = useSubnavigation();

  React.useEffect(() => {
    setSubnavigation([
      { path: '/questionnaires/create', label: 'Create' },
      { path: '/questionnaires/view-all', label: 'View All' },
      { path: '/questionnaires/view-single', label: 'View Single' },
    ]);

    return () => {
      setSubnavigation([]);
    };
  }, [setSubnavigation]);

  return (
    <Routes>
      <Route path="view-all" element={<ViewPolls />} />
      <Route path="create" element={<CreatePoll />} />
      <Route path="view-single" element={<ViewPoll />} />
      <Route index element={<ViewPolls />} />
    </Routes>
  );
}

export default PatientPollPage;
