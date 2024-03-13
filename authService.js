const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

const users = [];

app.use(bodyParser.json());

// User registration endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists.' });
  }

  const newUser = { username, password };
  users.push(newUser);

  return res.status(201).json({ message: 'User registered successfully.' });
});

// User login and token generation endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });

  return res.status(200).json({ token });
});

// Middleware to authenticate requests
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token is required.' });
  }

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  });
}

// Protected endpoint example
app.get('/profile', authenticateToken, (req, res) => {
  return res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

app.listen(port, () => {
  console.log(`Authentication Service is running on http://localhost:${port}`);
});
