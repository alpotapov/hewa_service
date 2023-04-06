import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import DxReaderIntegrationDemo from './pages/DxReaderIntegrationDemo';
import PatientPollPage from './pages/PatientPollPage/PatientPollPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/patient-poll">Patient Poll</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/patient-poll/*" element={<PatientPollPage />} />
            <Route path="/" element={<DxReaderIntegrationDemo />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
