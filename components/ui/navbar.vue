<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src width="112" height="28">
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
        <n-link to="/" class="navbar-item" no-prefetch>Главная</n-link>

        <n-link to="/dashboard/rb" class="navbar-item" no-prefetch>Рейдбоссы</n-link>
        <n-link to="/dashboard/items" class="navbar-item" no-prefetch>Предметы</n-link>
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
            <span
              v-if="user.groupInvite"
              @click="acceptInvitation(user.groupInvite)"
            >Вы приглашены в группу {{user.groupInvite.name}} ||</span>
            hello, {{user.username}}
            <span v-if="user.emailConfirmCode">(не подтвержден)</span>
            <span v-if="user.group">{{user.group.name}}</span>
          </div>
          <n-link v-if="user" to="/me/change" class="navbar-item">change</n-link>
          <a v-if="user" class="navbar-item" @click="signOut">Выйти</a>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "headerNavbar",
  computed: {
    ...mapGetters({ user: "user/getUser" })
  },
  methods: {
    signOut() {
      return this.$store.dispatch("user/signOut", this.user);
    },
    acceptInvitation(group) {
      this.$store
        .dispatch("user/acceptInvitation", { user: this.user, group })
        .then(res => {
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
  beforeMount() {
    this.$socket().on("you-connected", message => {
      console.log(message);
      if (this.user) {
        let user = {};
        user.id = this.user.id;

        if (this.user.group) {
          user.group = this.user.group.name;
        }

        this.$socket().emit("authorized", user);
      }
    });
  }
};
</script>