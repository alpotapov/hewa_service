import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import * as Sentry from '@sentry/react';
import DxReaderIntegrationDemo from './pages/DxReaderIntegrationDemo';
import PatientPollPage from './pages/PatientPollPage/PatientPollPage';
import DataRequest from './pages/DataRequest/DataRequest';
import PageBase from './pages/PageBase/PageBase';
import { SubnavigationProvider } from './contexts/SubnavigationContext';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  autoSessionTracking: true,
  debug: process.env.NODE_ENV === 'development',
  release: `webapp@${process.env.npm_package_version}`,
});

const queryClient = new QueryClient();

function App() {
  return (
    <Sentry.ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <SubnavigationProvider>
            <PageBase>
              <Routes>
                <Route path="/data-request/*" element={<DataRequest />} />
                <Route path="/questionnaires/*" element={<PatientPollPage />} />
                <Route path="/dxreader-demo" element={<DxReaderIntegrationDemo />} />
                <Route path="/" element={<DxReaderIntegrationDemo />} />
              </Routes>
            </PageBase>
          </SubnavigationProvider>
        </Router>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
}

export default App;
