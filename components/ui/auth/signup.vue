<template>
  <div class="container form auth">
    <b-field
      label="Name"
      :message="usernameError"
      :type="{'is-danger': usernameError.length, 'is-success':usernameSuccess}"
    >
      <b-input
        icon="account"
        v-model="username"
        :loading="usernameLoading"
        @input="checkUsername($event); isErrors='username'"
      ></b-input>
    </b-field>
    <b-field
      label="Email"
      :message="emailError"
      :type="{'is-danger':emailError.length, 'is-success':emailSuccess}"
    >
      <b-input
        ref="email"
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        icon="at"
        type="email"
        v-model="email"
        :loading="emailLoading"
        @input="checkEmail($event); isErrors = 'email'"
      ></b-input>
    </b-field>
    <b-field
      label="Password"
      :message="passwordError"
      :type="{'is-danger':passwordError.length, 'is-success':passwordSuccess}"
    >
      <b-input
        icon="lock"
        type="password"
        v-model="password"
        :passwordReveal="true"
        :loading="passwordLoading"
        @input="checkPassword($event); isErrors = 'password'"
      ></b-input>
    </b-field>
    <button
      class="button"
      :class="{'is-danger':isErrors, 'is-success':!isErrors}"
      :disabled="isErrors"
      @click="create"
    >Sign Up</button>
  </div>
</template>
 <script>
import debounce from "lodash/debounce";
export default {
  name: "registrationForm",
  data() {
    return {
      username: null,
      email: null,
      password: null,
      usernameError: [],
      usernameSuccess: false,
      usernameLoading: false,
      emailError: [],
      emailSuccess: false,
      emailLoading: false,
      passwordError: [],
      passwordSuccess: false,
      passwordLoading: false
    };
  },
  props: {
    prevRoute: {
      type: Object,
      required: false
    }
  },
  methods: {
    checkUsername: debounce(function(value) {
      this.usernameError = [];
      this.usernameSuccess = this.usernameLoading = false;
      if (value.length) {
        if (value.indexOf("@") >= 0) {
          this.usernameError.push(`Символ @ в никнейме запрещен`);
          return;
        }
        // Если что-то ввели в инпут - проверим наличие пользователя с никнеймом, соответствующим value
        this.$axios
          .post(`/users/check/username/`, { username: value })
          .then(res => {
            if (res.data.error) this.usernameError.push(res.data.error);
            if (res.data.message) {
              // Пользователь с таким логином не найден. Очищаем ошибку и присваиваем инпуту класс success
              this.usernameError = [];
              this.usernameSuccess = true;
            }
          })
          .catch(e => {
            this.usernameError = [];
          });
      }
    }, 1000),

    checkEmail: debounce(function(value) {
      this.emailError = [];
      this.emailSuccess = this.emailLoading = false;
      if (value.length) {
        // Проверим валидность email адреса
        const input = this.$refs.email.$el.querySelector("input");
        if (!input.checkValidity()) {
          this.emailError.push(input.validationMessage);
          return;
        }

        // Если что-то ввели в инпут - проверим наличие пользователя с email адресом, соответствующим value
        this.$axios
          .post(`/users/check/email/`, { email: value })
          .then(res => {
            if (res.data.error) this.emailError.push(res.data.error);
            if (res.data.message) {
              // Пользователь с таким email адресом не найден. Очищаем ошибку и присваиваем инпуту класс success
              this.emailError = [];
              this.emailSuccess = true;
            }
          })
          .catch(e => {
            this.emailError = [];
          });
      }
    }, 1000),

    checkPassword: debounce(function(value) {
      this.passwordError = [];
      this.passwordSuccess = this.passwordLoading = false;
      if (value.length) {
        if (/\s/g.test(value)) {
          this.passwordError.push(`Пробелы в пароле запрещены`);
        }
        if (value.length < 6)
          this.passwordError.push(
            `Пароль должен состоять минимум из 6 символов`
          );
        if (value.length >= 6 && !this.passwordError.length)
          this.passwordSuccess = true;
      }
    }, 500),
    create() {
      const user = {
        id: `${this.$moment().unix()}`,
        username: this.username,
        email: this.email,
        password: this.password
      };
      this.$store
        .dispatch("user/signUp", user)
        .then(res => {
          this.$snackbar.open({
            duration: 5000,
            message: `${res.data.message}`,
            type: "is-success",
            position: "is-bottom-right",
            queue: false
          });
          this.$router.push(this.prevRoute.fullPath);
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
    isErrors: {
      get: function() {
        return this.usernameSuccess && this.emailSuccess && this.passwordSuccess
          ? false
          : true;
      },

      set: function(value) {
        if (value === "username") {
          this.usernameSuccess = false;
          this.usernameLoading = true;
        }
        if (value === "email") {
          this.emailSuccess = false;
          this.emailLoading = true;
        }
        if (value === "password") {
          this.passwordSuccess = false;
          this.passwordLoading = true;
        }
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from;
    });
  }
};
</script>
 <style>
</style>