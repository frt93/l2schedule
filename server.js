const http = require('http');

const { Nuxt, Builder } = require('nuxt');
const express = require('express');
const SocketIO = require('socket.io');

const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

// We instantiate Nuxt.js with the options
const config = require('./nuxt.config.js');
config.dev = !isProd;

const nuxt = new Nuxt(config);
// Start build process in dev mode
if (config.dev) {
  const builder = new Builder(nuxt);
  builder.build();
}
app.use(nuxt.render);

// Listen the server
server.listen(port, '0.0.0.0');

let users = {};

io.on('connection', socket => {
  const connectedUser = io.sockets.connected[socket.id];
  connectedUser.emit('you-connected', 'you connected');
  console.log(`clients ${io.engine.clientsCount}`);
  /**
   * Сокет срабатывает при входе пользователя в приложение.
   * На клиенте эмитируется событие authorized и отправляется ID авторизованного пользователя.
   * Затем в объект users записывается свойство с переданным ID в качестве ключа и текущим сокетом пользователя, которому этот сокет принадлежит.
   * Эта операция помогает отправлять персональные сокеты пользователям
   *
   *
   * @param id                ID подключившегося пользователя
   * @return Object
   */
  socket.on('authorized', function(user) {
    // console.log(user);
    users[user.id] = socket.id;
    // console.log(`user joined`);
    // console.log(`userID: ${user.id}. user socket id: ${socket.id}`);
    const isRoomExist = io.sockets.adapter.rooms[user.group];
    // console.log(isRoomExist);
    const isUserAlreadyInRoom = isRoomExist && isRoomExist.sockets[socket.id];
    // console.log(isUserAlreadyInRoom);
    socket.join(user.group);
  });

  socket.on('log-out', function(userID, group) {
    console.log(`user logout`);
    console.log(`userID: ${userID}. user socket id: ${socket.id}. user group: ${group}`);
    delete users[userID];
    socket.leave(group);
  });

  /**
   * Сокет срабатывает при входе пользователя в приложение при условии, что он состоит в группе.
   * Именно к каналу этой группы он и подключается
   *
   * @param group             Название группы, которым будет называться socket.room

   */
  // socket.on('group-connect', function(group) {
  //   console.log(`group name: ${group}`);
  //   socket.join(group);
  //   console.log(`user joined group`);
  //   console.log(socket.id);
  // });

  /**
   * Сокет срабатывает при выходе пользователя из приложении.
   * Переберем объект users и найдем в нем свойство свойство хранящее сокет вышедшего пользователя.
   * Если пользователь был авторизован и свойство найдено - удаляем его
   *
   * @return Object
   */
  socket.on('disconnect', function(reason) {
    let disconnectedUser;
    for (var userID in users) {
      if (users[userID] === socket.id) {
        disconnectedUser = userID;
        console.log(`user disconnected: ${userID}`);
      }
    }
    if (disconnectedUser) delete users[disconnectedUser];
  });

  /**
   * Отправляем оповещение об обновлении РБ всем пользователям кроме инициатора редактирования
   * @param boss              Экземпляр РБ, который был создан
   * @param user              Экземпляр пользователя, который отредактировал информацию о РБ
   * @return Socket
   */
  socket.on('update-boss', function(boss, user) {
    const message = {
      date: new Date().toJSON(),
      message: `Информация о РБ ${boss.fullname} изменена пользователем ${user.username}`,
    };
    console.log(io.sockets.adapter.rooms[user.group.name].sockets);
    socket.broadcast.to(user.group.name).emit('raidboss-updated', message, boss, user);
  });

  /**
   * Отправляем оповещение о создании нового РБ всем пользователям, кроме создателя
   * @param boss              Экземпляр РБ, который был создан
   * @param user              Экземпляр пользователя, который создал РБ
   * @return Socket
   */
  socket.on('create-boss', function(boss, user) {
    const message = {
      date: new Date().toJSON(),
      message: `Пользователем ${user.username} добавлен новый РБ ${boss.fullname}`,
    };

    socket.broadcast.emit('raidboss-created', message, boss, user);
  });

  /**
   * Отправляем оповещение об удалении РБ всем пользователям кроме инициатора удаления
   * @param boss              Экземпляр РБ, который был удален
   * @param user              Экземпляр пользователя, который инициаровал удаление
   * @return Socket
   */
  socket.on('remove-boss', function(boss, user) {
    const message = {
      date: new Date().toJSON(),
      message: `Информация о РБ ${boss.fullname} удалена пользователем ${user.username}`,
    };

    socket.broadcast.emit('raidboss-removed', message, boss, user);
  });

  /**
   * Отправляем оповещение о приглашении в группу пользователю, которого пригласили
   * @param group             Экземпляр группы, в которую приглашают пользователя
   * @param invitee           Экземпляр пользователя, которого приглашают!
   * @param inviter           Экземпляр пользователя, который приглашает!
   * @return Socket
   */
  socket.on('invite-user', function(group, inviter, invitee) {
    const message = {
      date: new Date().toJSON(),
      message: `Вы были пришлашены пользователем ${inviter.username} в группу ${group.name}`,
    };

    const client = io.sockets.connected[users[invitee.id]];
    if (client) {
      client.emit('group-invite', message, inviter, invitee);
    }
  });

  /**
   * Отправляем оповещение о вступлении нового пользователя в группу всем другим участникам этой группы
   * @param group             Название группы
   * @param inviter           Экземпляр пользователя, который пригласил нового члена в группу!
   * @param invitee           Экземпляр пользователя, который вступил в группу!
   * @return Socket
   */

  socket.on('joined-to-group', function(group, inviter, invitee) {
    const message = {
      date: new Date().toJSON(),
      message: `Пользователь ${invitee.username} присоединился к вашей группе по приглашению ${
        inviter.username
      }`,
    };

    io.sockets.to(group.name).emit('user-joined', message, inviter, invitee);
    socket.join(group.name);
  });
});

module.exports = {
  io,
};
