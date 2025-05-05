const jwt = require('jsonwebtoken');

// Dummy user database
const users = [
  {
    id: 1,
    username: 'test',
    password: 'test123'
  }
];

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });
};

// Verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, 'your-secret-key');
  } catch (error) {
    return null;
  }
};

// Login function
const login = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return {
      token: generateToken(user),
      user: {
        id: user.id,
        username: user.username
      }
    };
  }
  return null;
};

// Register function
const register = (username, password) => {
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return null;
  }
  
  const newUser = {
    id: users.length + 1,
    username,
    password
  };
  
  users.push(newUser);
  return {
    token: generateToken(newUser),
    user: {
      id: newUser.id,
      username: newUser.username
    }
  };
};

module.exports = {
  login,
  register,
  verifyToken
}; 