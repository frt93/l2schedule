<template>
  <div></div>
</template>

<script>
export default {
  name: "removeCharacter",
  props: {
    account: {
      type: Object,
      required: true
    },
    character: {
      type: Object,
      required: true
    }
  },
  methods: {
    remove() {
      let account = this.account;
      this.$dialog.prompt({
        message: `Введите никнейм персонажа`,
        type: "is-danger",
        cancelText: "Отмена",
        confirmText: "Удалить",
        inputAttrs: {
          placeholder: this.character.nickname
        },
        onConfirm: value => {
          if (value === this.character.nickname) {
            account.characters = account.characters.filter(char => {
              return char.id !== this.character.id;
            });

            const user = this.$store.getters["user/getUser"];
            this.$store
              .dispatch("accounts/update", { account, user })
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