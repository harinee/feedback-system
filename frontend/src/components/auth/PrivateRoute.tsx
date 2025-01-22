import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Box, CircularProgress } from '@mui/material';

const PrivateRoute: React.FC = () => {
  const { oktaAuth, authState } = useOktaAuth();

  if (!authState) {
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

  if (!authState.isAuthenticated) {
    oktaAuth.signInWithRedirect();
    return null;
  }

  return <Outlet />;
};

export default PrivateRoute;
