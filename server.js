const express = require('express');
const bodyParser = require('body-parser');
const { authenticateToken } = require('./middleware');
const authService = require('./authService');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Mount the authentication service
app.use('/auth', authService);

// Protected endpoint example
app.get('/profile', authenticateToken, (req, res) => {
  return res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
