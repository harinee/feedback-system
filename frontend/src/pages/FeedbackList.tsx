import React, { useState, useEffect } from 'react';

interface Feedback {
  _id: string;
  content: string;
  isAnonymous: boolean;
  submitter?: string;
  status: 'New' | 'In Action' | 'Hold' | 'Closed';
  createdAt: string;
  updatedAt: string;
}
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
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedback', {
        headers: {
          'x-mock-user': 'mock-employee'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFeedbackList(data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-mock-user': 'mock-employee'
        },
        body: JSON.stringify({ content, isAnonymous }),
      });
      if (response.ok) {
        setContent('');
        setIsAnonymous(false);
        fetchFeedback(); // Refresh the feedback list after submission
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

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
            <React.Fragment key={feedback._id}>
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
