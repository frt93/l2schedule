const url = 'http://localhost:3333';
const jwtSignature = 'l2schedule token';
const registrationConfirmMessage = (user, token, code) => {
  const message = `Здравствуй, ${
    user.username
  }. Вы использовали данный адрес электронной почты при регистрации в приложении <a href="${url}">L2schedule</a>. <br>
    Для подтверждения регистрации перейдите по <a href="${url}/auth/confirm/?credential=email&token=${token}">ссылке</a> или воспользуйтесь кодом ${code} для подтверждения в личном кабинете. <br>
    Добро пожаловать в банду 👊 <br><br>
    Если вы не осуществляли подобной регистрации - проигнорируйте данное письмо.<br><br>Всего хорошего!
    `;
  return {
    text: '',
    from: 'L2schedule ✔',
    to: user.email,
    subject: 'Подтвердите регистрацию 🤝',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }],
  };
};
const emailChangeConfirmMessage = (user, token, code) => {
  const message = `Здравствуй, ${
    user.username
  }. Вы использовали данный адрес электронной почты для привязки к аккаунту на <a href="${url}">L2schedule</a>. <br>
    Для подтверждения перейдите по <a href="${url}/auth/confirm/?credential=email&token=${token}">ссылке</a> или воспользуйтесь кодом ${code} для подтверждения в личном кабинете. <br><br>
    Если вы не осуществляли подобной процедуры - проигнорируйте данное письмо.<br><br>Всего хорошего!
    `;
  return {
    text: '',
    from: 'L2schedule',
    to: user.email,
    subject: 'Подтвердите смену email адреса 📪',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }],
  };
};

const passwordChangeConfirmMessage = (user, token, code) => {
  const message = `Здравствуй, ${
    user.username
  }. Вы получили это письмо так как решили сменить пароль от аккаунта <a href="${url}">L2schedule</a>. <br>
    Для подтверждения перейдите по <a href="${url}/auth/confirm/?credential=password&token=${token}">ссылке</a> или воспользуйтесь кодом ${code} для подтверждения в личном кабинете. <br><br>
    Если вы не осуществляли подобной процедуры - проигнорируйте данное письмо.<br><br>Всего хорошего!
    `;
  return {
    text: '',
    from: 'L2schedule',
    to: user.email,
    subject: 'Подтвердите смену пароля 🔑',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }],
  };
};
module.exports = {
  url,
  jwtSignature,
  registrationConfirmMessage,
  emailChangeConfirmMessage,
  passwordChangeConfirmMessage,
};
