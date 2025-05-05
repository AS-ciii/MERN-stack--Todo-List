const express = require('express')
const cors = require('cors')
const router = require('./routes/routes')
const auth = require('./auth')
const app = express()
require('./models/db')
app.use(express.json())
app.use(cors())

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const result = auth.login(username, password);
  if (result) {
    res.json(result);
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  const result = auth.register(username, password);
  if (result) {
    res.json(result);
  } else {
    res.status(400).json({ message: 'Username already exists' });
  }
});

app.use('/api/tasks', router)
app.listen('8000', err => {
    if(err) console.log(err)
    console.log('Server is started at PORT number : 8000')
})