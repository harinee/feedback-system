import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import Dashboard from './pages/Dashboard';
import FeedbackList from './pages/FeedbackList';
import FeedbackDetail from './pages/FeedbackDetail';
import NotFound from './pages/NotFound';

// Keeping Okta implementation commented for future use:
/*
import { useOktaAuth } from '@okta/okta-react';
import { CircularProgress, Box } from '@mui/material';
import LoginCallback from '@/components/auth/LoginCallback';

const App = () => {
  const { authState } = useOktaAuth();

  if (authState?.isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // ... rest of the code
};
*/

const App = () => {
  return (
    <Routes>
      {/* Simplified routing structure */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="feedback" element={<FeedbackList />} />
        <Route path="feedback/:id" element={<FeedbackDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
