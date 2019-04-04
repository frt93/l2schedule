<template>
  <div></div>
</template>

<script>
export default {
  name: "removeItem",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    remove() {
      const item = this.item;
      this.$dialog.prompt({
        message: `Введите полное наименование предмета`,
        type: "is-danger",
        cancelText: "Отмена",
        confirmText: "Удалить",
        inputAttrs: {
          placeholder: item.fullname
        },
        onConfirm: value => {
          if (value === item.fullname) {
            this.$store
              .dispatch(`items/remove`, item)
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
              duration: 7000,
              message: `Вы ошиблись при указании наименования удаляемого предмета. Попробуйте снова`,
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
