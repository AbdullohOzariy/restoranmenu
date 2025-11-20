const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Mock data for now, will be replaced by database later
const initialData = require('./initialData');

// API endpoint to get all data at once
app.get('/api/all-data', (req, res) => {
  res.json(initialData);
});

// Serve static files from the React app
const buildPath = path.join(process.cwd(), 'dist');
app.use(express.static(buildPath));

app.get('/api', (req, res) => {
  res.send('Hello from the backend!');
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
