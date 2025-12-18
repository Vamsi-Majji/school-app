import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Button,
  Divider,
  IconButton,
  Badge,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Done as MarkAsReadIcon,
} from '@mui/icons-material';

const NotificationsPage = ({ role }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [notificationSettings, setNotificationSettings] = useState({
    assignments: true,
    grades: true,
    events: true,
    announcements: true,
    messages: true,
  });

  useEffect(() => {
    // Mock data - replace with API call
    setNotifications([
      {
        id: 1,
        type: 'assignment',
        title: 'New Assignment Posted',
        message: 'Mathematics homework due tomorrow',
        timestamp: '2024-01-10T09:00:00',
        read: false,
        priority: 'high',
        sender: 'Mr. Johnson'
      },
      {
        id: 2,
        type: 'grade',
        title: 'Grade Updated',
        message: 'Your Science project grade has been posted',
        timestamp: '2024-01-09T16:30:00',
        read: true,
        priority: 'medium',
        sender: 'Ms. Smith'
      },
      {
        id: 3,
        type: 'event',
        title: 'Parent-Teacher Meeting',
        message: 'Scheduled for January 15th at 3:00 PM',
        timestamp: '2024-01-08T11:15:00',
        read: false,
        priority: 'high',
        sender: 'School Admin'
      },
      {
        id: 4,
        type: 'announcement',
        title: 'School Holiday Notice',
        message: 'School will be closed on January 20th',
        timestamp: '2024-01-07T08:00:00',
        read: true,
        priority: 'medium',
        sender: 'Principal'
      },
      {
        id: 5,
        type: 'message',
        title: 'New Message from Teacher',
        message: 'Mr. Johnson sent you a message',
        timestamp: '2024-01-06T14:45:00',
        read: false,
        priority: 'low',
        sender: 'Mr. Johnson'
      },
    ]);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment': return <AssignmentIcon />;
      case 'grade': return <SchoolIcon />;
      case 'event': return <EventIcon />;
      case 'announcement': return <NotificationsActiveIcon />;
      case 'message': return <NotificationsIcon />;
      default: return <NotificationsIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Notifications
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  All Notifications
                  {unreadCount > 0 && (
                    <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }}>
                      <NotificationsIcon />
                    </Badge>
                  )}
                </Typography>
                <Box>
                  <Button size="small" onClick={markAllAsRead} disabled={unreadCount === 0}>
                    Mark All Read
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                {['all', 'unread', 'assignment', 'grade', 'event', 'announcement', 'message'].map(filterType => (
                  <Chip
                    key={filterType}
                    label={filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    onClick={() => setFilter(filterType)}
                    color={filter === filterType ? 'primary' : 'default'}
                    variant={filter === filterType ? 'filled' : 'outlined'}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              <List>
                {filteredNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      sx={{
                        backgroundColor: notification.read ? 'transparent' : 'action.hover',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: notification.read ? 'grey.300' : 'primary.main' }}>
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight={notification.read ? 'normal' : 'bold'}>
                              {notification.title}
                            </Typography>
                            <Chip
                              label={notification.priority}
                              color={getPriorityColor(notification.priority)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {notification.sender} • {formatTime(notification.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {!notification.read && (
                          <IconButton size="small" onClick={() => markAsRead(notification.id)}>
                            <MarkAsReadIcon />
                          </IconButton>
                        )}
                        <IconButton size="small" onClick={() => deleteNotification(notification.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < filteredNotifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              {filteredNotifications.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No notifications found
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.assignments}
                      onChange={(e) => setNotificationSettings({...notificationSettings, assignments: e.target.checked})}
                    />
                  }
                  label="Assignments"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.grades}
                      onChange={(e) => setNotificationSettings({...notificationSettings, grades: e.target.checked})}
                    />
                  }
                  label="Grades"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.events}
                      onChange={(e) => setNotificationSettings({...notificationSettings, events: e.target.checked})}
                    />
                  }
                  label="Events"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.announcements}
                      onChange={(e) => setNotificationSettings({...notificationSettings, announcements: e.target.checked})}
                    />
                  }
                  label="Announcements"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.messages}
                      onChange={(e) => setNotificationSettings({...notificationSettings, messages: e.target.checked})}
                    />
                  }
                  label="Messages"
                />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Total:</Typography>
                  <Typography variant="body2" fontWeight="bold">{notifications.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Unread:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="error.main">{unreadCount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">High Priority:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {notifications.filter(n => n.priority === 'high').length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">This Week:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {notifications.filter(n => {
                      const date = new Date(n.timestamp);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return date > weekAgo;
                    }).length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotificationsPage;
