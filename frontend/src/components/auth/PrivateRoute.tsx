import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// For development, we'll always be authenticated
const isDevelopment = process.env.NODE_ENV === 'development';

const PrivateRoute: React.FC = () => {
  // In development, skip authentication checks
  if (isDevelopment) {
    return <Outlet />;
  }

  // TODO: Replace with actual Okta authentication in production
  const isAuthenticated = true;
  const isLoading = false;

  if (isLoading) {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
