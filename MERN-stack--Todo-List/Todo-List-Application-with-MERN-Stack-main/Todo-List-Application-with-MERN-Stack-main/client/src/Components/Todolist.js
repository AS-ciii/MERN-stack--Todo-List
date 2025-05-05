import './Todolist.css'
import React, { useState } from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Box,
  Paper,
  Tooltip,
  Fade,
  Zoom,
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material'
import axios from 'axios'

function Todolist({ todolist, taskComplete, removeTask, tasktoUpdate, showPopup }) {
  const [hoveredTask, setHoveredTask] = useState(null)

  const handleTaskComplete = async (task) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/tasks/${task._id}`, {
        _id: task._id,
        todo: task.todo,
        isComplete: !task.isComplete
      })
      taskComplete(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleTaskDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/tasks/${id}`)
      removeTask(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <List sx={{ p: 0 }}>
        {todolist.map((task, index) => (
          <Fade in={true} timeout={300} key={task._id}>
            <ListItem
              sx={{
                py: 2,
                px: 3,
                borderBottom: index !== todolist.length - 1 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                },
              }}
              onMouseEnter={() => setHoveredTask(task._id)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Tooltip title={task.isComplete ? "Mark as incomplete" : "Mark as complete"}>
                  <IconButton
                    onClick={() => handleTaskComplete(task)}
                    sx={{
                      mr: 2,
                      color: task.isComplete ? 'success.main' : 'action.active',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      },
                    }}
                  >
                    {task.isComplete ? <CheckCircleIcon /> : <UncheckedIcon />}
                  </IconButton>
                </Tooltip>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: task.isComplete ? 'line-through' : 'none',
                        color: task.isComplete ? 'text.secondary' : 'text.primary',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      {task.todo}
                    </Typography>
                  }
                />
              </Box>
              <ListItemSecondaryAction
                sx={{
                  opacity: hoveredTask === task._id ? 1 : 0,
                  transition: 'opacity 0.2s ease-in-out',
                }}
              >
                <Tooltip title="Edit task">
                  <IconButton
                    onClick={() => {
                      tasktoUpdate(task)
                      showPopup()
                    }}
                    sx={{
                      mr: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete task">
                  <IconButton
                    onClick={() => handleTaskDelete(task._id)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        color: 'error.main',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          </Fade>
        ))}
        {todolist.length === 0 && (
          <Box
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No tasks yet</Typography>
            <Typography variant="body2">Add a new task to get started</Typography>
          </Box>
        )}
      </List>
    </Paper>
  )
}

export default Todolist
