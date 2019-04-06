<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
        </a>

        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <n-link to="/" class="navbar-item">Главная</n-link>

          <n-link to="/dashboard/rb" class="navbar-item">Рейдбоссы</n-link>
          <n-link to="/dashboard/items" class="navbar-item">Предметы</n-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons" v-if="!user">
              <n-link to="/auth/signup" class="navbar-item button is-primary">
                <strong>Sign up</strong>
              </n-link>
              <n-link to="/auth/signin" class="navbar-item button is-light">
                <strong>Log in</strong>
              </n-link>
            </div>
            <div v-if="user">
              hello, {{user.username}}
              <span v-if="user.emailConfirmCode">(не подтвержден)</span>
            </div>
            <n-link v-if="user" to="/me/change" class="navbar-item">change</n-link>
            <a v-if="user" class="navbar-item" @click="signOut">Выйти</a>
          </div>
        </div>
      </div>
    </nav>
    <div></div>
    <nuxt/>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({ user: "auth/getUser" })
  },
  methods: {
    signOut() {
      return this.$store.dispatch("auth/signOut");
    }
  }
};
</script>
<style>
.form .control input {
  transition: 0.3s linear;
}
.form .control .icon.is-left i,
.form .control .icon .mdi-eye {
  color: #dbdbdb;
}

.icon.is-right i:not(.mdi-eye) {
  -webkit-animation: scale 0.2s ease-out;
  animation: scale 0.2s ease-out;
}
.form .control .icon .mdi-eye-off {
  color: #7a7a7a !important;
}
.form .control .icon i:before {
  font-size: 16px;
}

button {
  transition: 0.5s;
}

@-webkit-keyframes scale {
  0% {
    -webkit-transform: scale(0.5, 0.5);
    transform: scale(0.5, 0.5);
  }
  100% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
  }
}

@keyframes scale {
  0% {
    -webkit-transform: scale(0.5, 0.5);
    transform: scale(0.5, 0.5);
  }
  100% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
  }
}
</style>


