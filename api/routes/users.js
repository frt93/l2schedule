const { Router } = require('express');
const router = Router();

const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const bosses = new FileAsync('db/bosses.json');

const email = require('emailjs/email');
const server = email.server.connect({
  user: 'tvinkzak2@gmail.com',
  password: 'God452yHgs854Kd',
  host: 'smtp.gmail.com',
  port: 465,
  ssl: true,
});
const message = {
  text: 'i hope this works 2',
  from: 'l2schedule 👻',
  to: 'frthere@gmail.com',
  subject: 'Confirm Registration ✔',
  // attachment: [{ data: '<html>i <i>hope</i> this works!</html>', alternative: true }],
};
router.get('/users/create', (req, res) => {
  const user = req.body;
  create(user);

  // server.send(message, function(err, message) {
  //   console.log(err || message);
  // });
});
module.exports = router;
