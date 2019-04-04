const config = require('../config');
const toLowerCaseAndReplaceSpaces = require('../plugins/mixins');

const { Router } = require('express');
const router = Router();

const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const users = new FileAsync('db/users.json');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtToken = config.jwtSignature;
const email = require('emailjs/email');
const sendEmail = email.server.connect({
  user: 'tvinkzak2@gmail.com',
  password: 'God452yHgs854Kd',
  host: 'smtp.gmail.com',
  port: 465,
  ssl: true,
});

low(users).then(db => {
  db._.mixin({
    // Проверяем уникальность пользователя, путем поиска среди уже существующих идентичных никнейма, email адреса
    // (предварительно прогнав их через метод toLowerCaseAndReplaceSpaces) или ID.
    // Эти три миксина вызываются в функции create() после получения коллекции пользователей и перед попыткой сохранить в ней нового
    isUniqueUsername: function(users, username) {
      if (
        users.findIndex(
          user =>
            toLowerCaseAndReplaceSpaces(user['username']) === toLowerCaseAndReplaceSpaces(username)
        ) === -1
      ) {
        return users;
      } else {
        throw {
          name: 'User already taken',
          message: `Пользователь с никнеймом ${username} уже сушествует`,
        };
      }
    },
    isUniqueEmail: function(users, email) {
      if (
        users.findIndex(
          user => toLowerCaseAndReplaceSpaces(user['email']) === toLowerCaseAndReplaceSpaces(email)
        ) === -1
      ) {
        return users;
      } else {
        throw {
          name: 'Email already taken',
          message: `Пользователь с email адресом ${email} уже сушествует`,
        };
      }
    },
    isUniqueID: function(users, id) {
      if (users.findIndex(user => user['id'] === id) === -1) {
        return users;
      } else {
        throw {
          name: 'ID already exist',
          message: `Пользователь с идентификатором ${id} уже сушествует`,
        };
      }
    },
  });

  router.get('/users/all', (req, res) => {
    getAllUsers(db);
  });

  router.get('/me', (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token)
      return res.status(400).send({ type: 'error', message: 'x-access-token header not found.' });
    jwt.verify(token, jwtToken, (error, result) => {
      if (error)
        return res
          .status(403)
          .send({ type: 'error', message: 'Provided token is invalid.', error });
      const user = findUserByID(db, result.id);
      return res.send(user);
    });
  });

  router.post('/me/change/email', (req, res) => {
    const user = req.body;
    changeEmail(db, user, res);
  });

  router.post('/me/confirm/email', (req, res) => {
    confirmEmailChangeHandle(req, res, db);
  });

  router.post('/me/change/password', (req, res) => {
    const user = req.body;
    changePassword(db, user, res);
  });

  router.post('/me/confirm/password', (req, res) => {
    confirmPasswordChangeHandle(req, res, db);
  });

  router.post('/me/update', (req, res) => {
    const user = req.body;
    update(db, user, res);
  }),
    router.post('/users/check/username/', (req, res) => {
      const username = req.body.username;
      const user = findUserByUsername(db, username);

      if (user)
        res.send({ user, error: `Уже существует пользователь с никнеймом ${user.username}` });
      else res.send({ message: `Пользователь с никнеймом ${username} не найден` });
    });

  router.post('/users/check/email/', (req, res) => {
    const email = req.body.email;
    const user = findUserByEmail(db, email);
    if (user)
      res.send({ user, error: `email адрес ${email} уже используется другим пользователем` });
    else res.send({ message: `Пользователь с email-адресом ${email} не найден` });
  });

  router.post('/users/signin', (req, res) => {
    const credentials = req.body;
    signin(db, credentials, res);
  });

  router.post('/users/signup', (req, res) => {
    const newUser = req.body;
    create(db, newUser, res);
  });
});

/**
 * Получаем всех пользователей из БД
 * @param db                Объект доступа к БД
 * @return Array
 */
const getAllUsers = db => {
  return db.get('users').value();
};

/**
 * Поиск пользователя в БД по ID
 * @param db                Объект доступа к БД
 * @param id                ID искомого пользователя
 * @return user Object
 */
const findUserByID = (db, id) => {
  const user = db
    .get('users')
    .find({ id: id })
    .value();
  return user;
};

/**
 * Поиск пользователя в БД по никнейму
 * @param db                Объект доступа к БД
 * @param username          Никнейм искомого пользователя
 * @return user Object
 */
const findUserByUsername = (db, username) => {
  const user = db
    .get('users')
    .find(function(user) {
      return toLowerCaseAndReplaceSpaces(user.username) === toLowerCaseAndReplaceSpaces(username);
    })
    .value();

  return user;
};

/**
 * Поиск пользователя в БД по email-адресу
 * @param db                Объект доступа к БД
 * @param email             Email-адрес искомого пользователя
 * @return user Object
 */
const findUserByEmail = (db, email) => {
  const user = db
    .get('users')
    .find(function(user) {
      return toLowerCaseAndReplaceSpaces(user.email) === toLowerCaseAndReplaceSpaces(email);
    })
    .value();
  return user;
};

/**
 * Создаем нового пользователя. Перед записью в БД хэшируем пароль
 * @param db                Объект доступа к БД
 * @param newUser           Экземпляр создаваемого пользователя
 * @param res               Объект ответа сервера
 * @return Promise          Промис с созданным пользователем или ошибкой
 */
const create = (db, newUser, res) => {
  const plaintextPassword = newUser.password;
  newUser.password = hashPassword(plaintextPassword);

  const { token, code } = emailConfirmToken(newUser);
  newUser.emailConfirmCode = `${code}`;

  const message = config.registrationConfirmMessage(user, token, code);

  db.get('users')
    .isUniqueID(newUser.id)
    .isUniqueUsername(newUser.username)
    .isUniqueEmail(newUser.email)
    .push(newUser)
    .write()
    .then(async users => {
      await emailConfirmMessage(message);
      await signin(db, { username: newUser.username, password: plaintextPassword }, res);
    })
    .catch(e => {
      res.status(500).send({ message: e });
    });
};

/**
 * Изменяем информацию пользователя
 * @param db                Объект доступа к БД
 * @param user              Экземпляр пользователя
 * @param res               Объект ответа сервера
 * @return Promise          Промис с измененным пользователем или ошибкой
 */
const update = (db, user, res) => {
  const isUsernamelUnique = findUserByUsername(db, user.username);
  if (isUsernamelUnique && isUsernamelUnique.id !== user.id)
    throw {
      name: 'Username already taken',
      message: `Пользователь с никнеймом ${user.username} уже сушествует`,
    };

  db.get('users')
    .chain()
    .find({ id: user.id })
    .assign(user)
    .write()
    .then(user => {
      res.send({ message: `Информация об аккаунте изменена`, user });
    })
    .catch(e => res.status(500).send(e));
};

/**
 * Меняем email адрес пользователя. Предварительно генерируем код подтверждения и токен.
 * В случае успешного изменения - отправляет письмо на новый электронный адрес
 * @param db                Объект доступа к БД
 * @param user              Экземпляр пользователя
 * @param res               Объект ответа сервера
 * @return Promise          Промис с созданным пользователем или ошибкой
 */
const changeEmail = (db, user, res) => {
  const isEmailUnique = findUserByEmail(db, user.email);
  if (isEmailUnique)
    throw {
      name: 'User exist',
      message: `Пользователь с email адресом ${user.email} уже сушествует`,
    };

  const { token, code } = emailConfirmToken(user);
  const message = config.emailChangeConfirmMessage(user, token, code);

  db.get('users')
    .chain()
    .find({ id: user.id })
    .assign({ email: user.email, emailConfirmCode: `${code}` })
    .write()
    .then(async user => {
      await emailConfirmMessage(message);
      res.send({ message: `На новый email адрес было выслано письмо для подтверждения`, user });
    })
    .catch(e => res.status(500).send({ message: e }));
};

/**
 * Определяем каким способом подтверждается смена email адреса: путем перехода по ссылке из письма или
 * с помощью кода подтверждения в личном кабинете
 * @param req               Объект запроса
 * @param res               Объект ответа сервера
 * @param db                Объект доступа к БД
 * @return mixed
 */
const confirmEmailChangeHandle = (req, res, db) => {
  const token = req.body.token;
  const byCode = req.body.code;
  let code, id;
  if (byCode) {
    // Если подтверждаем с помощью кода подтверждения в личном кабинете
    code = byCode;
    id = req.body.id;
  }
  if (token) {
    // Если подтверждаем с помощью ссылки из письма
    jwt.verify(token, jwtToken, (error, result) => {
      if (error) {
        return res.status(403).send({ type: 'error', message: 'Код подтвержения неверен', error });
      }
      id = result.id;
      code = result.code;
    });
  }
  const user = findUserByID(db, id);

  if (!user) {
    throw {
      name: 'User not found',
      message: `Пользователь не найден`,
    };
  }
  if (Number(user.emailConfirmCode) === Number(code)) {
    return confirmEmail(db, id, res);
  } else if (!user.emailConfirmCode) {
    throw {
      name: 'email already confirmed',
      message: `Данный email адрес уже подтвержден`,
    };
  } else {
    throw {
      name: 'Confirmation token invalid',
      message: `Код подтвержения неверен`,
    };
  }
};

/**
 * Подтверждаем email адрес пользователя.
 * @param db                Объект доступа к БД
 * @param id                ID пользователя
 * @param res               Объект ответа сервера
 * @return Object
 */
const confirmEmail = (db, id, res) => {
  const user = db.get('users').find({ id: id });
  user.unset('emailConfirmCode').write();

  return res.send({ message: `email адрес подтвержден`, user });
};

/**
 * Запускаем процесс смены пароля пользователя. Предварительно проверим, чтобы пользователь ввел правильный текущий пароль.
 * Если пароль верный - генерируем код подтверждения и токен. Затем обновляем экземпляр пользователя в бд добавляя к нему свойства
 * с новым паролем (в незашифрованном виде) и кода подтверждения. По итогам высылается пимьсо на email с кодом и ссылкой для подтверждения
 * @param db                Объект доступа к БД
 * @param user              Экземпляр пользователя
 * @param res               Объект ответа сервера
 * @return Object
 */
const changePassword = (db, user, res) => {
  const plaintextCurrentPassword = user.oldPassword;
  const compare = comparePasswords(plaintextCurrentPassword, user.password);
  if (!compare) {
    res.status(403).send({ key: 'currentPassword', message: `Вы ввели неверный текущий пароль` });
    return;
  }

  const { token, code } = emailConfirmToken(user);
  const message = config.passwordChangeConfirmMessage(user, token, code);

  db.get('users')
    .chain()
    .find({ id: user.id })
    .assign({ newPassword: user.newPassword, passwordConfirmCode: `${code}` })
    .write()
    .then(async user => {
      await emailConfirmMessage(message);
      res.send({ message: `На ваш email адрес было выслано письмо для подтверждения`, user });
    })
    .catch(e => res.status(500).send({ message: e }));
};

/**
 * Определяем каким способом подтверждается смена пароля: путем перехода по ссылке из письма или
 * с помощью кода подтверждения в личном кабинете
 * @param req               Объект запроса
 * @param res               Объект ответа сервера
 * @param db                Объект доступа к БД
 * @return mixed
 */
const confirmPasswordChangeHandle = (req, res, db) => {
  const token = req.body.token;
  const byCode = req.body.code;
  let code, id;
  if (byCode) {
    // Если подтверждаем с помощью кода подтверждения в личном кабинете
    code = byCode;
    id = req.body.id;
  }
  if (token) {
    // Если подтверждаем с помощью ссылки из письма
    jwt.verify(token, jwtToken, (error, result) => {
      if (error) {
        return res.status(403).send({ type: 'error', message: 'Код подтвержения неверен', error });
      }
      id = result.id;
      code = result.code;
    });
  }
  const user = findUserByID(db, id);

  if (!user) {
    throw {
      name: 'User not found',
      message: `Пользователь не найден`,
    };
  }
  if (Number(user.passwordConfirmCode) === Number(code)) {
    return confirmPasswordChange(db, id, res);
  } else if (!user.passwordConfirmCode) {
    throw {
      name: 'Password already confirmed',
      message: `Пароль уже подтвержден`,
    };
  } else {
    throw {
      name: 'Confirmation token invalid',
      message: `Код подтвержения неверен`,
    };
  }
};

/**
 * Подтверждаем смену пароля пользователя. Хэшируем новый пароль. Затем удаляем из эксземпляра пользователя в БД свойства с новым паролем
 * в незашифрованном виде и кода подтверждения. Перезаписываем пароль от аккаунта и сохраняем
 * @param db                Объект доступа к БД
 * @param id                ID пользователя
 * @param res               Объект ответа сервера
 * @return Object
 */
const confirmPasswordChange = (db, id, res) => {
  const user = db.get('users').find({ id: id });
  const newPassword = hashPassword(user.value().newPassword);

  user.unset('newPassword').value();
  user.unset('passwordConfirmCode').value();
  user.assign({ password: newPassword }).value();
  user.write();

  return res.send({ message: `Смена пароля подтверждена`, user });
};

/**
 * Составляем токен для подтверждения email адреса или смены пароля
 * @param user              Экземпляр пользователя, id которого войдет в состав токена
 * @return Object           token, code
 */
const emailConfirmToken = user => {
  const code = Math.floor(Math.random() * (9999999999 - 1000000000) + 1000000000);
  const token = jwt.sign({ id: user.id, code: code }, jwtToken);
  return { token, code };
};

/**
 * Составляем и отправляем письмо на почту для подтверждения email адреса
 * @param message           Текст сообщения
 */
const emailConfirmMessage = message => {
  sendEmail.send(message, function(err, response) {
    console.log(err || response);
  });
};

/**
 * Хэшируем пароль пользователя
 * @param password          Пароль пользователя
 * @return String
 */
const hashPassword = password => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Проверяем совпадение указанного пароля с паролем, сохраненным в ДБ
 * @param plaintext         Пароль, указанный пользователем в виде строки
 * @param hash              Пароль, сохраненный в ДБ в виде хэша
 * @return Boolean
 */
const comparePasswords = (plaintext, hash) => {
  return bcrypt.compareSync(plaintext, hash);
};

/**
 * Пробуем авторизовать пользователя
 * @param db                Объект доступа к БД
 * @param credentials       Данные, с помощью которых пользователь пытается авторизовать.
 *                          Это никнейм/email и пароль
 * @param res               Объект ответа сервера
 * @return Object           Экземпляр пользователя
 */
const signin = async (db, credentials, res) => {
  let user;
  let errorMessage;
  if (credentials.username) {
    // Если пользователь авторизуется с помощью никнейма
    user = await findUserByUsername(db, credentials.username);
    errorMessage = `Пользователь с никнеймом ${credentials.username} не найден`;
  } else if (credentials.email) {
    // Если пользователь авторизуется с помощью email-адреса
    user = await findUserByEmail(db, credentials.email);
    errorMessage = `Пользователь с email-адресом ${credentials.email} не найден`;
  }

  if (user) {
    const compare = await comparePasswords(credentials.password, user.password);
    if (compare) {
      const token = jwt.sign({ id: user.id, username: user.username }, jwtToken);
      const message = `Здравствуйте, ${user.username}. Вы успешно авторизовались`;
      res.send({ user, token, message });
    } else {
      res.status(403).send({ key: 'password', message: `Вы ввели неверный пароль` });
    }
  } else {
    res.status(403).send({ key: 'login', message: errorMessage });
  }
};
module.exports = router;
