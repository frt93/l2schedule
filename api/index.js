const express = require('express');
// const SocketIO = require('socket.io');
const bodyParser = require('body-parser');
// Create express instnace

const app = express();
const io = require('socket.io').listen(app.listen(4000));
// app.use(async (req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   next();
// });

app.use(bodyParser.json());

// Require API routes
const raidbosses = require('./routes/rb');
const items = require('./routes/items');
const users = require('./routes/users');

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Import API Routes
app.use('/rb', raidbosses);
app.use('/items', items);
app.use(users);

// Socket.io
const messages = [];
io.on('connection', socket => {
  socket.on('last-messages', fn => {
    fn(messages.slice(-50));
  });
  socket.on('send-message', message => {
    messages.push(message);
    socket.broadcast.emit('new-message', message);
  });
});
// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
};
