<template>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">
          Изменить информацию об аккаунте
          <span
            class="login"
            @click="$emit('copy')"
          >{{account.login}}</span>
        </p>
      </div>
    </div>
    <div class="content">
      <update :account="account" :action="'edit'" @update="update"></update>
    </div>
  </div>
</template>

<script>
import update from "./accountForm";
export default {
  name: "editAccountForm",
  components: {
    update
  },
  props: {
    account: {
      type: Object,
      requqired: true
    }
  },
  methods: {
    update(account) {
      const user = this.$store.getters["user/getUser"];

      this.$store
        .dispatch("accounts/update", { account, user })
        .then(res => {
          this.$snackbar.open({
            message: res.data.message,
            duration: 5000,
            queue: false
          });
          this.$emit("updated");
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