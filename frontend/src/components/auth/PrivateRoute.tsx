import { Outlet } from 'react-router-dom';

// Simple development-mode route guard
// TODO: Implement proper authentication in production
// Keeping Okta implementation commented for future use:
/*
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useOktaAuth } from '@okta/okta-react';

const PrivateRoute: React.FC = () => {
  const { authState } = useOktaAuth();
  
  if (authState?.isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!authState?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
*/

const PrivateRoute = () => {
  // Always allow access in development
  return <Outlet />;
};

export default PrivateRoute;
