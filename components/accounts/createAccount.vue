<template>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">Добавить новый аккаунт</p>
      </div>
    </div>
    <div class="content">
      <template>
        <form class="account" method="POST">
          <b-field label="Логин">
            <b-input placeholder="Логин аккаунта" v-model="account.login" required></b-input>
          </b-field>
          <b-field label="Пароль">
            <b-input placeholder="Пароль аккаунта" v-model="account.password" required></b-input>
          </b-field>
          <b-field label="Мастер аккаунт">
            <b-input placeholder="Логин мастер аккаунта" v-model="account.master"></b-input>
          </b-field>
          <b-field label="Пароль мастер аккаунта">
            <b-input placeholder="Пароль мастер аккаунта" v-model="account.masterPassword"></b-input>
          </b-field>
          <b-field label="Тип аккаунта">
            <div class="block">
              <b-radio v-model="account.type" native-value="main">Мейн</b-radio>
              <b-radio v-model="account.type" native-value="tvink">Твинк</b-radio>
              <b-radio v-model="account.type" native-value="trader">Трейдер</b-radio>
              <b-radio v-model="account.type" native-value="watcher">Палилка</b-radio>
            </div>
          </b-field>
          <b-field label="Владелец чара">
            <b-input placeholder="Мембер, который сидит на мейне" v-model="account.owner"></b-input>
          </b-field>

          <button class="button is-success" type="button" @click="create">Создать</button>
        </form>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "itemsForm",
  data() {
    return {
      account: {
        login: "",
        password: "",
        master: "",
        masterPassword: "",
        type: "",
        owner: "",
        characters: []
      }
    };
  },
  methods: {
    create() {
      const user = this.$store.getters["user/getUser"];
      const account = this.account;
      account.id = `${this.$moment().unix()}`;
      this.$store
        .dispatch("accounts/create", { account, user })
        .then(res => {
          this.$snackbar.open({
            message: res.data.message,
            duration: 5000,
            queue: false
          });
          this.$emit("created");
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
  }
};
</script>

<style>
.modal-form {
  padding: 0;
}
</style>