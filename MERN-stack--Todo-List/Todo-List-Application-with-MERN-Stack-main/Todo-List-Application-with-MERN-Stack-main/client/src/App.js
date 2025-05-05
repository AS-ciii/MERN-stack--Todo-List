import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Container, 
  Box, 
  Paper, 
  Typography, 
  AppBar, 
  Toolbar, 
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  List as ListIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Addtask from './Components/Addtask';
import Todolist from './Components/Todolist';
import Updatetask from './Components/Updatetask';
import Login from './Components/Login';
import Register from './Components/Register';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: 'rgba(255, 255, 255, 0.8)',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  const [todolist, setTodolist] = useState([]);
  const [tasktoUpdate, setTasktoUpdate] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchTasks();
    }
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:8000/api/tasks', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      setTodolist(res.data);
    })
    .catch(err => console.log(err));
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      fetchTasks();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', { username, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      fetchTasks();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setTodolist([]);
  };

  const addTask = newTask => {
    setTodolist([...todolist, newTask]);
  };

  const taskComplete = task => {
    const newList = [...todolist];
    newList.forEach(item => {
      if (item._id === task._id) {
        item.isComplete = task.isComplete;
      }
    });
    setTodolist(newList);
  };

  const removeTask = task => {
    const newList = todolist.filter(item => !(item._id === task._id));
    setTodolist(newList);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back!
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <ListIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Tasks" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AddIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Add Task" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static" elevation={0}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Todo App
              </Typography>
              <Tooltip title={user?.username}>
                <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}>
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
              </Tooltip>
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ fontWeight: 600 }}
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{
              sx: {
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }
            }}
          >
            {drawer}
          </Drawer>
          <Container maxWidth="md" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Fade in={true} timeout={500}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Addtask addTask={addTask} />
                <Todolist
                  todolist={todolist}
                  taskComplete={taskComplete}
                  removeTask={removeTask}
                  tasktoUpdate={task => {
                    setTasktoUpdate(task);
                    setShowPopup(true);
                  }}
                  showPopup={() => setShowPopup(true)}
                />
              </Box>
            </Fade>
            <Updatetask
              task={tasktoUpdate}
              showPopup={showPopup}
              updateTask={task => {
                const newList = [...todolist];
                newList.forEach(item => {
                  if (item._id === task._id) {
                    item.todo = task.todo;
                  }
                });
                setTodolist(newList);
                setShowPopup(false);
              }}
              hidePopup={() => setShowPopup(false)}
            />
          </Container>
        </Box>
      ) : (
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}>
          {showLogin ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Register onRegister={handleRegister} />
          )}
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;
