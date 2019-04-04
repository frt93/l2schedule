<template>
  <div></div>
</template>

<script>
export default {
  name: "removeRaidBoss",
  props: {
    boss: {
      type: Object,
      required: true
    }
  },
  methods: {
    remove() {
      const boss = this.boss;
      this.$dialog.prompt({
        message: `Введите полное имя РБ`,
        type: "is-danger",
        cancelText: "Отмена",
        confirmText: "Удалить",
        inputAttrs: {
          placeholder: boss.fullname
        },
        onConfirm: value => {
          if (value === boss.fullname) {
            this.$store
              .dispatch("raidbosses/remove", boss)
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
              message: `Вы ошиблись при указании имени удаляемого РБ. Попробуйте снова`,
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