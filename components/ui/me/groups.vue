<template>
  <div class="container form" v-if="user">
    <div v-if="!user.group">
      <b-field label="Создать группу">
        <b-input icon="account-group" v-model="group"></b-input>
      </b-field>
      <button class="button is-success" @click="create">Создать</button>
    </div>
    <div v-if="user.group">
      <b-field label="Пригласить пользователя">
        <b-autocomplete
          ref="input"
          icon="account-multiple-plus"
          placeholder="Введите имя пользователя"
          field="username"
          size="is-large"
          :data="data"
          :loading="isFetching"
          @typing="getAsyncData($event); isFetching = true; data=[]"
          @select="option => userToInvite = option"
        >
          <template slot-scope="props" v-if="!isFetching">
            <div class="media-left"></div>
            <div class="media-content">
              {{ props.option.username }}
              <br>
              <small v-if="props.option.group">{{props.option.group.name}}</small>
            </div>
          </template>
        </b-autocomplete>
      </b-field>
      <button class="button is-success" :disabled="!userToInvite" @click="invite">Пригласить</button>
    </div>

    <div>
      <p v-for="user in users" :key="user.id">
        {{user.username}}
        <a v-if="!user.group">
          <i class="mdi mdi-account-multiple-plus" @click="userToInvite = user, invite()"></i>
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import debounce from "lodash/debounce";
export default {
  name: "groupManageComponent",
  data() {
    return {
      userToInvite: "",
      group: "",
      data: [],
      isFetching: false
    };
  },
  computed: {
    ...mapGetters({ user: "user/getUser", users: "user/getAll" })
  },
  methods: {
    getAsyncData: debounce(function(username) {
      this.data = [];
      const users = this.users.filter(user => {
        return (
          this.$toLowerCaseAndReplaceSpaces(user.username).indexOf(
            this.$toLowerCaseAndReplaceSpaces(username)
          ) >= 0
        );
      });
      users.forEach(user => {
        if (!user.group || user.group.id !== this.user.group.id) {
          this.data.push(user);
        }
      });
      this.isFetching = false;
    }, 500),

    create() {
      const group = {};
      group.name = this.group;
      group.id = `${this.$moment().unix()}`;
      group.creatorID = this.user.id;
      this.$store
        .dispatch("user/createGroup", group)
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
    invite() {
      const group = this.user.group;
      const inviter = this.user;
      const invitee = this.userToInvite;

      if (!invitee) {
        return;
      }

      this.$store
        .dispatch("user/inviteToGroup", { group, invitee, inviter })
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
    this.$store.dispatch("user/fetchAllUsers");
  }
};
</script>
