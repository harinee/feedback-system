import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { CircularProgress, Box } from '@mui/material';
import Layout from '@/components/Layout';
import LoginCallback from '@/components/auth/LoginCallback';
import PrivateRoute from '@/components/auth/PrivateRoute';
import Dashboard from '@/pages/Dashboard';
import FeedbackList from '@/pages/FeedbackList';
import FeedbackDetail from '@/pages/FeedbackDetail';
import NewFeedback from '@/pages/NewFeedback';
import NotFound from '@/pages/NotFound';

const App: React.FC = () => {
  const { authState } = useOktaAuth();

  if (authState?.isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login/callback" element={<LoginCallback />} />
      
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feedback" element={<FeedbackList />} />
          <Route path="/feedback/new" element={<NewFeedback />} />
          <Route path="/feedback/:id" element={<FeedbackDetail />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
