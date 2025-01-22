import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const FeedbackList: React.FC = () => {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, isAnonymous }),
      });
      if (response.ok) {
        setContent('');
        setIsAnonymous(false);
        // In a real app, we would refresh the feedback list here
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  // Dummy data for demonstration
  const feedbackList = [
    { id: 1, content: 'Sample feedback 1', status: 'New' },
    { id: 2, content: 'Sample feedback 2', status: 'In Action' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Feedback
      </Typography>

      {/* Submit Feedback Form */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Your Feedback"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
            }
            label="Submit Anonymously"
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Submit Feedback
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Feedback List */}
      <Paper>
        <List>
          {feedbackList.map((feedback, index) => (
            <React.Fragment key={feedback.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText
                  primary={feedback.content}
                  secondary={`Status: ${feedback.status}`}
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default FeedbackList;
