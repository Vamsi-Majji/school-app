import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  InputAdornment,
  IconButton,
  Badge,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Search as SearchIcon,
  Message as MessageIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const MessagesPage = ({ role }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data - replace with API call
    setConversations([
      {
        id: 1,
        name: 'Mr. Johnson',
        role: 'Teacher',
        lastMessage: 'Please review the homework assignment',
        timestamp: '2024-01-10T10:30:00',
        unread: 2,
        avatar: 'MJ'
      },
      {
        id: 2,
        name: 'Ms. Smith',
        role: 'Teacher',
        lastMessage: 'Great work on your project!',
        timestamp: '2024-01-09T14:20:00',
        unread: 0,
        avatar: 'MS'
      },
      {
        id: 3,
        name: 'School Admin',
        role: 'Administrator',
        lastMessage: 'Reminder: Parent-teacher meeting tomorrow',
        timestamp: '2024-01-08T09:15:00',
        unread: 1,
        avatar: 'SA'
      },
    ]);

    setMessages([
      { id: 1, sender: 'Mr. Johnson', content: 'Hello! How are you doing with the math assignment?', timestamp: '2024-01-10T10:00:00', isMine: false },
      { id: 2, sender: 'Me', content: 'Hi Mr. Johnson! I\'m working on it. Could you clarify question 3?', timestamp: '2024-01-10T10:15:00', isMine: true },
      { id: 3, sender: 'Mr. Johnson', content: 'Sure! Question 3 is about...', timestamp: '2024-01-10T10:30:00', isMine: false },
    ]);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'Me',
        content: newMessage,
        timestamp: new Date().toISOString(),
        isMine: true
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Messages
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 0 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </CardContent>
            <Divider />
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <List>
                {filteredConversations.map((conversation) => (
                  <ListItem
                    key={conversation.id}
                    button
                    selected={selectedConversation?.id === conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        '&:hover': { backgroundColor: 'primary.main' }
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge badgeContent={conversation.unread} color="error">
                        <Avatar>{conversation.avatar}</Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">{conversation.name}</Typography>
                          <Chip label={conversation.role} size="small" variant="outlined" />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {conversation.lastMessage}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(conversation.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                <CardContent sx={{ flex: 0, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar>{selectedConversation.avatar}</Avatar>
                    <Box>
                      <Typography variant="h6">{selectedConversation.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedConversation.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.isMine ? 'flex-end' : 'flex-start',
                        mb: 2
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1.5,
                          maxWidth: '70%',
                          backgroundColor: message.isMine ? 'primary.main' : 'grey.100',
                          color: message.isMine ? 'white' : 'text.primary'
                        }}
                      >
                        <Typography variant="body1">{message.content}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {formatTime(message.timestamp)}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>

                <CardContent sx={{ flex: 0, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small">
                              <AttachFileIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </Button>
                  </Box>
                </CardContent>
              </>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <MessageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="outlined" startIcon={<PersonIcon />}>
                  Message Teacher
                </Button>
                <Button variant="outlined" startIcon={<PersonIcon />}>
                  Message Parent
                </Button>
                <Button variant="outlined" startIcon={<PersonIcon />}>
                  Message Administrator
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Message Statistics
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Total Conversations:</Typography>
                <Typography fontWeight="bold">{conversations.length}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Unread Messages:</Typography>
                <Typography fontWeight="bold" color="error.main">
                  {conversations.reduce((sum, conv) => sum + conv.unread, 0)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Active Chats:</Typography>
                <Typography fontWeight="bold" color="success.main">
                  {conversations.filter(conv => conv.unread > 0).length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MessagesPage;
