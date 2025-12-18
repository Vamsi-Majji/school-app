import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';
import { Feedback as FeedbackIcon } from '@mui/icons-material';

const FeedbackPage = ({ role }) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Mock feedback submission
    console.log('Feedback submitted:', feedback);
    setSubmitted(true);
    setFeedback('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Feedback Channel
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FeedbackIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Share Your Feedback
                </Typography>
              </Box>

              {submitted && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Thank you for your feedback! It has been submitted successfully.
                </Alert>
              )}

              <TextField
                multiline
                rows={6}
                fullWidth
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Please share your thoughts, suggestions, or concerns..."
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!feedback.trim()}
                fullWidth
              >
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FeedbackPage;
