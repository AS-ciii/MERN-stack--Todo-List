import './Updatetask.css'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Paper,
  Fade,
  Zoom,
} from '@mui/material'
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Check as CheckIcon,
} from '@mui/icons-material'

function Updatetask({ task, showPopup, updateTask, hidePopup }) {
  const [updatedTask, setUpdatedTask] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (task) {
      setUpdatedTask(task.todo || '')
    }
  }, [task])

  const handleUpdate = () => {
    if (!updatedTask.trim()) {
      hidePopup()
      return
    }

    setIsSubmitting(true)
    axios.put(`http://localhost:8000/api/tasks/${task._id}`, {
      _id: task._id,
      todo: updatedTask,
      isComplete: task.isComplete
    })
    .then(res => {
      updateTask(res.data)
      hidePopup()
    })
    .catch(err => console.log(err))
    .finally(() => setIsSubmitting(false))
  }

  if (!showPopup) return null

  return (
    <Dialog
      open={showPopup}
      onClose={hidePopup}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }
      }}
      TransitionComponent={Zoom}
      transitionDuration={300}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Update Task
          </Typography>
        </Box>
        <IconButton
          onClick={hidePopup}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            background: 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Current Task
          </Typography>
          <Typography variant="body1">
            {task?.todo}
          </Typography>
        </Paper>

        <TextField
          autoFocus
          fullWidth
          label="New Task"
          variant="outlined"
          value={updatedTask}
          onChange={(e) => setUpdatedTask(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <EditIcon sx={{ color: 'action.active', mr: 1 }} />
            ),
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={hidePopup}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          startIcon={<CheckIcon />}
          disabled={isSubmitting || !updatedTask.trim()}
          sx={{
            borderRadius: 2,
            px: 3,
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
            },
            '&.Mui-disabled': {
              background: 'rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          {isSubmitting ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Updatetask
