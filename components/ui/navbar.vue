<template>
  <nav id="navbar" class role="navigation" aria-label="main navigation">
    <div class="level">
      <div class="level-left">
        <n-link to="/" class="navbar-item">Рейдовые боссы</n-link>
        <n-link
          to="/dashboard/rb"
          class="navbar-item"
          v-if="user && user.privileges==='master'"
        >Рейдбоссы</n-link>
        <n-link
          to="/dashboard/items"
          class="navbar-item"
          v-if="user && user.privileges==='master'"
        >Предметы</n-link>
        <n-link to="/accounts" class="navbar-item">Аккаунты</n-link>
      </div>

      <div class="level-right">
        <div class="navbar-item notifications">
          <notifications></notifications>
        </div>
        <div class="navbar-item">
          <div class="account" v-if="user">
            <span class="account-notify" v-if="user.emailConfirmCode || user.groupInvite">●</span>
            <b-dropdown position="is-bottom-left" aria-role="menu">
              <a class="navbar-item" slot="trigger" role="button">
                <i class="mdi mdi-account mdi-24px"></i>
              </a>
              <b-dropdown-item custom aria-role="menuitem">
                Здоровенькi були,
                <b>{{user.username}}</b>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item
                aria-role="menuitem"
                v-if="user.groupInvite"
                :class="{'warning':user.groupInvite}"
                @click="acceptInvitation(user.groupInvite)"
              >
                <b-icon icon="account-group"></b-icon>
                <span class="text">Вы приглашены в группу {{user.groupInvite.name}}</span>
              </b-dropdown-item>
              <b-dropdown-item aria-role="menuitem" v-if="user.group">
                <b-icon icon="account-group"></b-icon>
                <span class="text">{{user.group.name}}</span>
              </b-dropdown-item>
              <b-dropdown-item
                aria-role="menuitem"
                v-if="user.emailConfirmCode"
                :class="{'warning':user.emailConfirmCode}"
                @click="toSettings"
              >
                <span>
                  <b-icon icon="email"></b-icon>
                  <span class="text">Подтвердите email</span>
                </span>
              </b-dropdown-item>

              <b-dropdown-item @click="toSettings">
                <b-icon icon="settings"></b-icon>
                <span class="text">Настройки</span>
              </b-dropdown-item>
              <hr class="dropdown-divider" aria-role="menuitem">
              <b-dropdown-item aria-role="menuitem" @click="signOut">
                <b-icon icon="logout"></b-icon>
                <span class="text">Выйти</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <div v-if="!user" class="auth">
            <n-link to="/auth/signup">
              <b-tooltip :label="`Зарегистрироваться`" position="is-left" type="is-dark" animated>
                <strong>
                  <i class="mdi mdi-account-multiple-plus-outline mdi-24px"></i>
                </strong>
              </b-tooltip>
            </n-link>
            <n-link to="/auth/signin">
              <b-tooltip :label="`Залогиниться`" position="is-left" type="is-dark" animated>
                <strong>
                  <i class="mdi mdi-login mdi-24px"></i>
                </strong>
              </b-tooltip>
            </n-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapGetters } from "vuex";
import notifications from "../ui/me/notifications";
export default {
  name: "headerNavbar",
  components: {
    notifications
  },
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
    },
    toSettings() {
      this.$router.push("/me");
    }
  },
  beforeMount() {
    if (this.user) {
      const userID = this.user.id;
      this.$socket().emit("authorized", userID);
      if (this.user.group) {
        const group = this.user.group.name;

        this.$socket().emit("group-connect", group);
      }
    }
  },
  mounted() {
    if (process.browser) {
      this.$nextTick(function() {
        window.addEventListener("scroll", function() {
          var navbar = document.getElementById("navbar");
          var nav_classes = navbar.classList;
          if (document.documentElement.scrollTop >= 250) {
            if (nav_classes.contains("sticky") === false) {
              nav_classes.toggle("sticky");
            }
          } else {
            if (nav_classes.contains("sticky") === true) {
              nav_classes.toggle("sticky");
            }
          }
        });
      });
    }
  }
};
</script>

<style>
/* html {
  background: url("/other/bg.gif");
} */
.navbar-start .navbar-item:first-of-type {
  padding-left: 0;
}

.navbar-end .navbar-item:last-of-type {
  padding-right: 0;
}

#navbar {
  position: relative;
}

#navbar.sticky {
  position: sticky;
  top: 0;
  right: 0;
  left: 0;
  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.1);
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  color: #4a4a4a;
  z-index: 2;
  background: #fff;

  -webkit-animation: scaleNav 0.3s ease-in-out;
  animation: scaleNav 0.3s ease-in-out;
}

@-webkit-keyframes scaleNav {
  0% {
    -webkit-transform: translateY(-30px) scaleY(0.8);
    transform: translateY(-30px) scaleY(0.8);
  }
  100% {
    -webkit-transform: translateY(0) scaleY(1);
    transform: translateY(0) scaleY(1);
  }
}

@keyframes scaleNav {
  0% {
    -webkit-transform: translateY(-30px) scaleY(0.8);
    transform: translateY(-30px) scaleY(0.8);
  }
  100% {
    -webkit-transform: translateY(0) scaleY(1);
    transform: translateY(0) scaleY(1);
  }
}

#navbar .dropdown-menu {
  z-index: 50;
}

#navbar .dropdown-item {
  padding: 0.375rem 1rem !important;
}

#navbar a {
  color: inherit;
}

#navbar .auth a {
  margin-left: 10px;
}
.navbar-item.notifications {
  padding: 0;
}
.norifications .trigger {
  cursor: pointer;
}

.norifications .trigger i:before {
  transition: 2s ease-in-out;
  -webkit-animation: swinging 2s ease-in-out 0s infinite;
  -moz-animation: swinging 2s ease-in-out 0s infinite;
  animation: swinging 2s ease-in-out 0s infinite;
  -webkit-transform-origin: 50% 0%;
  -moz-transform-origin: 50% 0;
  transform-origin: 50% 0;
  content: " \F09A";
}
.norifications .trigger i:hover:before {
  content: "\F09E";
}

.norifications .log-date:after {
  content: "•";
  margin-left: 3px;
}

.norifications a.reset {
  right: 0 !important;
  color: #fff !important;
}

.notifications-count {
  position: absolute;
  left: 0px;
  top: 6px;
  padding: 1px 3px;
  margin: 0;
  font-size: 10px;
  line-height: 11px;
  display: inline-block;
  color: white;
  background: #e03030;
  z-index: 2;
}

.dropdown-item.warning,
.dropdown-item.warning:hover,
.dropdown-item.warning:active {
  background-color: #e03030;
  color: #fff !important;
}
.dropdown-item .text {
  vertical-align: text-bottom;
  line-height: 24px;
}

.account .account-notify {
  position: absolute;
  top: 14px;
  left: 27px;
  color: #e03030;
  z-index: 2;
}
@keyframes bell {
  0% {
    content: "\F09E";
  }
  50% {
    content: " \F09A";
  }
  100% {
    content: "\F09E";
  }
}

@keyframes swinging {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(2deg);
  }
  50% {
    transform: rotate(-1deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@-webkit-keyframes swinging {
  0% {
    -webkit-transform: rotate(0);
  }
  25% {
    -webkit-transform: rotate(2deg);
  }
  50% {
    -webkit-transform: rotate(-1deg);
  }
  100% {
    -webkit-transform: rotate(0deg);
  }
}

@-moz-keyframes swinging {
  0% {
    -moz-transform: rotate(0);
  }
  25% {
    -moz-transform: rotate(2deg);
  }
  50% {
    -moz-transform: rotate(-1deg);
  }
  100% {
    -moz-transform: rotate(0deg);
  }
}
</style>