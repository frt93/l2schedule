<template>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">Добавить новый аккаунт</p>
      </div>
    </div>
    <div class="content">
      <create :account="account" :action="'create'" @create="create"></create>
    </div>
  </div>
</template>

<script>
import create from "./accountForm";
export default {
  name: "createAccount",
  components: {
    create
  },
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
    create(newAccount) {
      const user = this.$store.getters["user/getUser"];

      const account = newAccount;
      account.id = `${this.$moment().unix()}`;
      account.characters = [];
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