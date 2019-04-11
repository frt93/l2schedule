<template>
  <form class="account" method="POST">
    <b-field label="Логин">
      <b-input placeholder="Логин аккаунта" v-model="login" required></b-input>
    </b-field>
    <b-field label="Пароль">
      <b-input placeholder="Пароль аккаунта" v-model="password" required></b-input>
    </b-field>
    <b-field label="Мастер аккаунт">
      <b-input placeholder="Логин мастер аккаунта" v-model="master"></b-input>
    </b-field>
    <b-field label="Пароль мастер аккаунта">
      <b-input placeholder="Пароль мастер аккаунта" v-model="masterPassword"></b-input>
    </b-field>
    <b-field label="Тип аккаунта">
      <div class="block">
        <b-radio v-model="type" native-value="main">Мейн</b-radio>
        <b-radio v-model="type" native-value="10+">10+</b-radio>
        <b-radio v-model="type" native-value="qa">Твинк для АК</b-radio>
        <b-radio v-model="type" native-value="zaken">Твинк для Закена</b-radio>
        <b-radio v-model="type" native-value="trader">Трейдер</b-radio>
        <b-radio v-model="type" native-value="watcher">Палилка</b-radio>
      </div>
    </b-field>
    <b-field label="Владелец чара" v-if="type==='main'">
      <b-input placeholder="Мембер, который сидит на мейне" v-model="owner"></b-input>
    </b-field>
    <div class="level">
      <div class="level-left"></div>
      <div class="level-right">
        <button
          class="button is-success"
          type="button"
          v-if="action==='create'"
          @click="$emit('create', composeAccountData())"
        >Создать</button>
        <button
          class="button is-success"
          type="button"
          v-if="action==='edit'"
          @click="$emit('update', composeAccountData())"
        >Сохранить</button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: "manageAccountForm",
  data() {
    return {
      login: this.account.login,
      password: this.account.password,
      master: this.account.master,
      masterPassword: this.account.masterPassword,
      type: this.account.type,
      owner: this.account.owner,
      characters: this.account.characters
    };
  },
  props: {
    account: {
      type: Object,
      required: true
    },
    action: {
      type: String,
      required: true
    }
  },
  methods: {
    composeAccountData() {
      let account = {
        id: this.account.id,
        login: this.login,
        password: this.password,
        master: this.master,
        masterPassword: this.masterPassword,
        type: this.type
      };
      if (this.type === "main") account.owner = this.owner;
      return account;
    }
  }
};
</script>

<style>
.modal-form {
  padding: 0;
}
</style>