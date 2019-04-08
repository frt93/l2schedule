<template>
  <div></div>
</template>

<script>
export default {
  name: "removeAccount",
  props: {
    account: {
      type: Object,
      required: true
    }
  },
  methods: {
    remove() {
      const account = this.account;
      this.$dialog.prompt({
        message: `Введите пароль аккаунта`,
        type: "is-danger",
        cancelText: "Отмена",
        confirmText: "Удалить",
        inputAttrs: {
          placeholder: account.password
        },
        onConfirm: value => {
          if (value === account.password) {
            const user = this.$store.getters["user/getUser"];
            this.$store
              .dispatch("accounts/remove", { account, user })
              .then(res => {
                this.$snackbar.open({
                  message: res.data.message,
                  duration: 5000,
                  queue: false
                });
                this.$emit("removed");
              })
              .catch(e => {
                this.$snackbar.open({
                  duration: 5000,
                  message: `${e.response.data.error.message}`,
                  type: "is-danger",
                  position: "is-bottom-left",
                  actionText: "OK",
                  queue: false
                });
              });
          } else {
            this.$snackbar.open({
              duration: 5000,
              message: `Вы ошиблись при указании пароля от удаляемого аккаунта. Попробуйте снова`,
              type: "is-danger",
              position: "is-bottom-left",
              actionText: "OK",
              queue: false
            });
            this.$emit("removed");
          }
        },
        onCancel: () => {
          this.$emit("removed");
        }
      });
    }
  },
  mounted() {
    this.remove();
  },
  beforeDestroy() {
    this.$emit("removed");
  }
};
</script>