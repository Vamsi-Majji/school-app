import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const AssignmentsPage = ({ role }) => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionDialog, setSubmissionDialog] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    // Mock data - replace with API call
    setAssignments([
      {
        id: 1,
        title: 'Math Homework - Algebra',
        description: 'Solve the following algebraic equations...',
        dueDate: '2024-01-15',
        type: 'homework',
        status: 'pending',
        subject: 'Mathematics',
        teacher: 'Mr. Johnson',
        attachments: ['algebra_problems.pdf'],
        submissions: []
      },
      {
        id: 2,
        title: 'Science Project - Solar System',
        description: 'Create a model of the solar system...',
        dueDate: '2024-01-20',
        type: 'project',
        status: 'submitted',
        subject: 'Science',
        teacher: 'Ms. Smith',
        attachments: ['project_guidelines.pdf'],
        submissions: [{ date: '2024-01-10', status: 'submitted' }]
      },
      {
        id: 3,
        title: 'English Essay - Literature Analysis',
        description: 'Write a 1000-word essay analyzing...',
        dueDate: '2024-01-25',
        type: 'essay',
        status: 'overdue',
        subject: 'English',
        teacher: 'Mrs. Davis',
        attachments: [],
        submissions: []
      }
    ]);
  }, []);

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleSubmitAssignment = () => {
    // Mock submission
    const updatedAssignments = assignments.map(assignment =>
      assignment.id === selectedAssignment.id
        ? { ...assignment, status: 'submitted', submissions: [...assignment.submissions, { date: new Date().toISOString().split('T')[0], status: 'submitted' }] }
        : assignment
    );
    setAssignments(updatedAssignments);
    setSubmissionDialog(false);
    setSubmissionText('');
    setUploadedFile(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'submitted': return 'success';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ScheduleIcon />;
      case 'submitted': return <CheckCircleIcon />;
      case 'overdue': return <ScheduleIcon />;
      default: return <AssignmentIcon />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        {role === 'student' ? 'My Assignments' : 'Assignments Management'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assignment List
              </Typography>
              <List>
                {assignments.map((assignment, index) => (
                  <React.Fragment key={assignment.id}>
                    <ListItem
                      button
                      onClick={() => handleViewAssignment(assignment)}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getStatusIcon(assignment.status)}
                            <Typography variant="subtitle1" fontWeight="medium">
                              {assignment.title}
                            </Typography>
                            <Chip
                              label={assignment.status}
                              color={getStatusColor(assignment.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {assignment.subject} • Due: {assignment.dueDate} • {assignment.teacher}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < assignments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Total Assignments:</Typography>
                  <Typography fontWeight="bold">{assignments.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Pending:</Typography>
                  <Typography fontWeight="bold" color="warning.main">
                    {assignments.filter(a => a.status === 'pending').length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Submitted:</Typography>
                  <Typography fontWeight="bold" color="success.main">
                    {assignments.filter(a => a.status === 'submitted').length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Overdue:</Typography>
                  <Typography fontWeight="bold" color="error.main">
                    {assignments.filter(a => a.status === 'overdue').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {selectedAssignment && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {selectedAssignment.title}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip label={selectedAssignment.type} color="primary" sx={{ mr: 1 }} />
              <Chip label={selectedAssignment.subject} color="secondary" sx={{ mr: 1 }} />
              <Chip label={`Due: ${selectedAssignment.dueDate}`} color={getStatusColor(selectedAssignment.status)} />
            </Box>
            <Typography variant="body1" paragraph>
              {selectedAssignment.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Teacher: {selectedAssignment.teacher}
            </Typography>

            {selectedAssignment.attachments.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Attachments:
                </Typography>
                {selectedAssignment.attachments.map((attachment, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <DescriptionIcon />
                    <Typography variant="body2">{attachment}</Typography>
                    <Tooltip title="Download">
                      <IconButton size="small">
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              </Box>
            )}

            {selectedAssignment.submissions.length > 0 && (
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Submission History</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedAssignment.submissions.map((submission, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`Submitted on ${submission.date}`}
                          secondary={`Status: ${submission.status}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}
          </CardContent>
          <CardActions>
            {role === 'student' && selectedAssignment.status !== 'submitted' && (
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setSubmissionDialog(true)}
              >
                Submit Assignment
              </Button>
            )}
          </CardActions>
        </Card>
      )}

      <Dialog open={submissionDialog} onClose={() => setSubmissionDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Submit Assignment: {selectedAssignment?.title}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Submission Notes"
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            fullWidth
          >
            Upload File
            <input
              type="file"
              hidden
              onChange={(e) => setUploadedFile(e.target.files[0])}
            />
          </Button>
          {uploadedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {uploadedFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmissionDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitAssignment} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssignmentsPage;
