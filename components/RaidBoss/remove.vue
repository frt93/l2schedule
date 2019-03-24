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
            this.$axios
              .post(`/rb/${boss.id}/remove`)
              .then(res => {
                this.$emit("removed");
                this.$store.commit("raidbosses/remove", boss);
                this.$snackbar.open({
                  message: res.data,
                  duration: 7000,
                  queue: false
                });
              })
              .catch(e => {
                this.$snackbar.open({
                  duration: 7000,
                  message: `${e.response.data.error.message}`,
                  type: "is-danger",
                  position: "is-bottom-left",
                  actionText: "OK",
                  queue: false
                });
              });
          } else {
            this.$emit("removed");
            this.$snackbar.open({
              duration: 7000,
              message: `Вы ошиблись при указании имени удаляемого РБ. Попробуйте снова`,
              type: "is-danger",
              position: "is-bottom-left",
              actionText: "OK",
              queue: false
            });
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