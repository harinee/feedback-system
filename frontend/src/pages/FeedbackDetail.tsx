import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  Divider
} from '@mui/material';

const FeedbackDetail: React.FC = () => {
  const { id } = useParams();

  // Dummy data for demonstration
  const feedback = {
    id,
    content: 'This is a sample feedback content.',
    status: 'New',
    createdAt: new Date().toLocaleDateString(),
    isAnonymous: false,
    submitter: 'john.doe@example.com'
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Feedback Details
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={feedback.status}
              color={feedback.status === 'New' ? 'primary' : 'default'}
              size="small"
            />
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Content
            </Typography>
            <Typography variant="body1">
              {feedback.content}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Submitted By
            </Typography>
            <Typography variant="body1">
              {feedback.isAnonymous ? 'Anonymous' : feedback.submitter}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Submitted On
            </Typography>
            <Typography variant="body1">
              {feedback.createdAt}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default FeedbackDetail;
