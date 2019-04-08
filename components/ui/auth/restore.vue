<template>
  <div class="container form auth">
    <div class="first-stage" v-if="!restored">
      <b-notification
        type="is-warning"
        :closable="false"
      >Если вы утеряли доступ к своему аккаунту, то для начала введите никнейм или email адрес, к которому он привязан</b-notification>
      <b-field>
        <b-input
          placeholder="Ваш никнейм или email"
          :icon="loginIcon"
          key="login-input"
          v-model="login"
          @input="checkLogin"
          expanded
        ></b-input>
        <p class="control">
          <button
            class="button"
            :class="{'is-danger':isErrors, 'is-success':!isErrors}"
            :disabled="isErrors"
            @click="restore"
          >Восстановить</button>
        </p>
      </b-field>
      <b-message type="is-danger" v-if="loginKeyError.length">
        <p v-for="error in loginKeyError" :key="error">{{error}}</p>
      </b-message>
      <button class="button is-danger" @click="$router.back()">Назад</button>
      <button
        class="button"
        :disabled="login.length > 0"
        :class="{'is-danger':login.length > 0, 'is-success':login.length === 0}"
        @click="restored = true"
      >У меня уже есть код восстановления</button>
    </div>

    <div class="second-stage" v-else>
      <b-notification type="is-success" :closable="false">{{restoredMessage}}</b-notification>
      <b-field :message="loginKeyError" :type="{'is-danger':codeError.length}">
        <b-input
          type="number"
          placeholder="Код восстановления доступа"
          icon="numeric"
          key="code-input"
          v-model="code"
          @input="checkLogin"
        ></b-input>
      </b-field>
      <b-field :message="passwordError" :type="{'is-danger':passwordError.length}">
        <b-input
          placeholder="Введите ваш новый пароль"
          icon="lock"
          key="password-input"
          type="password"
          :passwordReveal="true"
          :disabled="code.length < 10"
          :loading="passwordLoading"
          v-model="password"
          @input="checkPassword($event); isChangeButtonError ='error'"
        ></b-input>
      </b-field>
      <button class="button is-danger" @click="restored = false">Назад</button>
      <button
        class="button"
        :class="{'is-danger': passwordError.length, 'is-success':!passwordError.length}"
        :disabled="isChangeButtonError"
        @click="change"
      >Сменить пароль</button>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
export default {
  name: "restorePassword",
  data() {
    return {
      restored: "",
      restoredMessage:
        "Если у вас уже есть код - введите его в поле ниже, чтобы сменить пароль к своему аккаунту",
      login: "",
      loginIcon: "account",
      loginKeyError: [],
      passwordLoading: false,
      code: "",
      codeError: [],
      password: "",
      passwordError: []
    };
  },
  methods: {
    checkLogin(value) {
      this.loginKeyError = [];

      if (/\\/g.test(value)) {
        this.loginKeyError.push(`Символ '\\' запрещен`);
      }
      if (/\//g.test(value)) {
        this.loginKeyError.push(`Символ '/' запрещен`);
      }

      const isEmail = value.indexOf("@") >= 0;
      if (isEmail) {
        this.loginKey = "email";
        this.loginIcon = "at";
        if (/\s/g.test(value)) {
          this.loginKeyError.push(`Пробелы в email адресе запрещены`);
        }
      } else {
        this.loginKey = "username";
        this.loginIcon = "account ";
      }
    },

    checkPassword: debounce(function(value) {
      this.passwordError = [];
      this.passwordLoading = false;
      if (/\s/g.test(value)) {
        this.passwordError.push(`Пробелы в пароле запрещены`);
      }
      if (value.length < 6)
        this.passwordError.push(`Пароль должен состоять минимум из 6 символов`);
    }, 500),

    restore() {
      let key = {};
      if (this.loginKey === "username") key.username = this.login;
      else key.email = this.login;
      this.$store
        .dispatch("user/restore", key)
        .then(res => {
          // Письмо на email с кодом восстановления отправлено.
          // Устанавливаем свойству restored значение true и переходим к следующему этапу восстановления (созданию нового пароля)

          this.restored = true;
          this.restoredMessage = res.data.message;
        })
        .catch(e => {
          this.loginKeyError.push(e.response.data.error.message);
          this.restored = this.restoredMessage = false;
        });
    },
    change() {
      const payload = { id: this.code, password: this.password };
      this.$store
        .dispatch("user/reset", payload)
        .then(res => {
          // Успешно сменили пароль и залогинились. Отправляемся на главную страницу
          this.$router.push("/");
          this.$snackbar.open({
            duration: 5000,
            message: `${res.data.message}`,
            type: "is-success",
            position: "is-bottom-right",
            queue: false
          });
        })
        .catch(e => {
          this.$snackbar.open({
            duration: 5000,
            message: `${e.response.data.error.message}`,
            type: "is-danger",
            position: "is-bottom-left",
            queue: false
          });
        });
    }
  },
  computed: {
    isErrors() {
      return this.loginKeyError.length || !this.login.length ? true : false;
    },
    isChangeButtonError: {
      get: function() {
        return this.password.length < 6 || this.passwordLoading ? true : false;
      },

      set: function(value) {
        this.passwordLoading = true;
      }
    }
  }
};
</script>
