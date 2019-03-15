const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const form = multer();
// Create express instnace
const app = express();

app.use(async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(form.array());

// Require API routes
const users = require('./routes/users');
const raidbosses = require('./routes/raidbosses');
//

// Import API Routes
app.use(users);
app.use(raidbosses);

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
};
