const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Use body-parser middleware to parse POST request data
app.use(bodyParser.urlencoded({ extended: true }));

// Use express-session middleware for session management
app.use(session({
  secret: 'your-secret-key', // Change this to a strong secret key
  resave: false,
  saveUninitialized: true
}));

// Dummy user for demonstration purposes
const dummyUser = {
  username: 'admin',
  password: 'admin123'
};

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
};

// Login route
app.get('/login', (req, res) => {
  res.send(`
    <h2>Login Page</h2>
    <form method="post" action="/login">
      <label for="username">Username:</label>
      <input type="text" name="username" required>
      <br>
      <label for="password">Password:</label>
      <input type="password" name="password" required>
      <br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password match the dummy user
  if (username === dummyUser.username && password === dummyUser.password) {
    req.session.user = username; // Store the username in the session
    res.redirect('/dashboard');
  } else {
    res.send('Invalid username or password');
  }
});

// Dashboard route - requires authentication
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`<h2>Welcome to the Dashboard, ${req.session.user}!</h2><a href="/logout">Logout</a>`);
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/login');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
