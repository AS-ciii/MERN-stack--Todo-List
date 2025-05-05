import './Addtask.css'
import React, { useState } from 'react'
import {
  Box,
  TextField,
  IconButton,
  Paper,
  InputAdornment,
  Zoom,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import axios from 'axios'

function Addtask({ addTask }) {
  const [task, setTask] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTask = async () => {
    if (!task.trim()) return

    setIsSubmitting(true)
    try {
      const response = await axios.post('http://localhost:8000/api/tasks', {
        todo: task,
        isComplete: false
      })
      setTask('')
      addTask(response.data)
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleAddTask()
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSubmitting}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AddIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            },
          }}
        />
        <Tooltip title="Add Task">
          <Zoom in={task.trim().length > 0}>
            <IconButton
              onClick={handleAddTask}
              disabled={isSubmitting || !task.trim()}
              sx={{
                p: 2,
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
            >
              {isSubmitting ? <AddIcon /> : <SendIcon />}
            </IconButton>
          </Zoom>
        </Tooltip>
      </Box>
    </Paper>
  )
}

export default Addtask
