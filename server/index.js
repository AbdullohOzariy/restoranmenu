const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the React app.
// 'dist' folder is in the project root, so we use process.cwd()
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
