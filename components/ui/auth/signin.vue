<template>
  <div class="container auth">
    <b-field label="Name" :message="loginKeyError" :type="{'is-danger':loginKeyError.length}">
      <b-input type="text" :icon="loginIcon" v-model="login" @input="checkLogin"></b-input>
    </b-field>
    <b-field label="Password" :message="passwordError" :type="{'is-danger':passwordError.length}">
      <b-input
        type="password"
        icon="lock"
        v-model="password"
        :passwordReveal="true"
        :loading="passwordLoading"
        @input="checkPassword($event); isErrors='login'"
      ></b-input>
    </b-field>
    <button
      class="button"
      :class="{'is-danger':isErrors, 'is-success':!isErrors}"
      :disabled="isErrors"
      @click="signin"
    >Sign in</button>
  </div>
</template>
 <script>
import debounce from "lodash/debounce";
export default {
  name: "loginForm",
  data() {
    return {
      login: "",
      loginKey: "username",
      loginIcon: "account",
      password: "",
      loginKeyError: [],
      passwordError: [],
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
    checkLogin(value) {
      this.loginKeyError = this.passwordError = [];

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

    signin() {
      this.loginKeyError = this.passwordError = "";
      let user = {
        password: this.password
      };
      if (this.loginKey === "username") user.username = this.login;
      else user.email = this.login;
      this.$store
        .dispatch("auth/signIn", user)
        .then(res => {
          this.$snackbar.open({
            duration: 5000,
            message: `${res.data.message}`,
            type: "is-success",
            position: "is-bottom-right",
            queue: false
          });
          if (this.prevRoute.name !== "auth-confirm")
            this.$router.push(this.prevRoute.fullPath);
          else this.$router.push("/");
        })
        .catch(e => {
          const error = e.response.data;
          if (error.key === "password") {
            this.passwordError = `${error.message}`;
          } else {
            this.loginKeyError = `${error.message}`;
          }
        });
    }
  },
  computed: {
    isErrors: {
      get: function() {
        return this.loginKeyError.length ||
          this.passwordError.length ||
          this.password.length < 6 ||
          !this.login ||
          this.passwordLoading
          ? true
          : false;
      },

      set: function(value) {
        this.passwordLoading = true;
      }
    }
  }
};
</script>

<style>
</style>

 