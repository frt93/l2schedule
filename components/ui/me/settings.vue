<template>
  <div class="container form user">
    <div v-if="data && !data.emailConfirmCode">
      <b-field label="Email">
        <b-input icon="at" v-model="user.email"></b-input>
      </b-field>
      <button class="button is-success" @click="email">Изменить email</button>
    </div>
    <div v-if="data && data.emailConfirmCode">
      <b-field label="Код подтверждения смены email">
        <b-input icon="lock" type="number" v-model="emailCode"></b-input>
      </b-field>
      <button class="button is-success" @click="confirmEmail">Подтвердить email</button>
    </div>
    <div v-if="data && !data.passwordConfirmCode">
      <b-field
        label="Сменить пароль"
        :type="{'is-danger':currentPasswordError.length}"
        :message="currentPasswordError"
      >
        <b-input
          icon="lock"
          type="password"
          placeholder="Ваш текущий пароль"
          v-model="oldPassword"
          :passwordReveal="true"
          @input="currentPasswordError=[]"
        ></b-input>
      </b-field>
      <b-field>
        <b-input
          icon="lock"
          type="password"
          placeholder="Ваш новый пароль"
          v-model="newPassword"
          :passwordReveal="true"
        ></b-input>
      </b-field>
      <button
        class="button is-success"
        :disabled="currentPasswordError.length || oldPassword.length < 6 || newPassword.length < 6"
        @click="password"
      >Изменить пароль</button>
    </div>
    <div v-if="data && data.passwordConfirmCode">
      <b-field label="Код подтверждения смены пароля">
        <b-input icon="lock" type="number" v-model="userCode"></b-input>
      </b-field>
      <button class="button is-success" @click="confirmPassword">Подтвердить пароль</button>
    </div>

    <div>
      <b-field label="Сменить никнейм">
        <b-input icon="lock" v-model="user.username"></b-input>
      </b-field>

      <b-field label="Использовать московское время?">
        <b-switch
          v-model="isSetTimeToMoscow"
          true-value="true"
          false-value="false"
        >{{ isSetTimeToMoscow }}</b-switch>
      </b-field>
      <button class="button is-success" @click="update">Отправить</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "changeAccountData",

  data() {
    return {
      emailCode: "",
      userCode: "",
      oldPassword: "",
      newPassword: "",
      currentPasswordError: [],
      user: this.data,
      isSetTimeToMoscow: this.$store.state.user.isSetTimeToMoscow
    };
  },
  props: {
    data: {
      required: true
    }
  },
  methods: {
    email() {
      this.$axios
        .post("/me/change/email", this.user)
        .then(res => {
          this.$snackbar.open({
            duration: 5000,
            message: `${res.data.message}`,
            type: "is-success",
            position: "is-bottom-right",
            queue: false
          });
          this.$store.commit("user/set_user", res.data.user);
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
    },
    password() {
      let user = this.user;
      user.oldPassword = this.oldPassword;
      user.newPassword = this.newPassword;
      this.$axios
        .post("/me/change/password", user)
        .then(res => {
          this.$snackbar.open({
            duration: 5000,
            message: `${res.data.message}`,
            type: "is-success",
            position: "is-bottom-right",
            queue: false
          });
          this.$store.commit("user/set_user", res.data.user);
        })
        .catch(e => {
          const error = e.response.data;
          if (error.key === "currentPassword") {
            this.currentPasswordError.push(error.message);
          }
          console.log(error);
          this.$snackbar.open({
            duration: 5000,
            message: `${error.message}`,
            type: "is-danger",
            position: "is-bottom-left",
            queue: false
          });
        });
    },
    confirmEmail() {
      this.$axios
        .post(`/me/confirm/email`, { code: this.emailCode, id: this.user.id })
        .then(res => {
          this.$snackbar.open({
            duration: 5000,
            message: `${res.data.message}`,
            type: "is-success",
            position: "is-bottom-right",
            queue: false
          });
          this.$store.commit("user/set_user", res.data.user);
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
    },
    confirmPassword() {
      this.$axios
        .post(`/me/confirm/password`, { code: this.userCode, id: this.user.id })
        .then(res => {
          this.$snackbar.open({
            duration: 5000,
            message: `${res.data.message}`,
            type: "is-success",
            position: "is-bottom-right",
            queue: false
          });
          this.$store.dispatch("user/signOut");
          this.$router.push("/user/signin");
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
    },
    update() {
      let user = this.user;
      this.$axios
        .post(`/me/update`, user)
        .then(res => {
          this.$snackbar.open({
            duration: 5000,
            message: `${res.data.message}`,
            type: "is-success",
            position: "is-bottom-right",
            queue: false
          });
          this.$store.commit("user/set_user", res.data.user);
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
  watch: {
    isSetTimeToMoscow(newValue) {
      this.$store.commit("user/isSetTimeToMoscow", newValue);
    }
  }
};
</script>
