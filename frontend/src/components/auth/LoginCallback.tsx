import React from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Box, CircularProgress } from '@mui/material';

const LoginCallback: React.FC = () => {
  const { oktaAuth } = useOktaAuth();

  React.useEffect(() => {
    oktaAuth.handleLoginRedirect();
  }, [oktaAuth]);

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
};

export default LoginCallback;
