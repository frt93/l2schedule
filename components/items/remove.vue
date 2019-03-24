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
            this.$axios
              .post(`/item/${item.id}/remove`)
              .then(res => {
                this.$store.commit("items/remove", item);
                this.$snackbar.open({
                  message: res.data,
                  duration: 7000,
                  queue: false
                });
                this.$emit("removed");
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
              message: `Вы ошиблись при указании наименования удаляемого предмета. Попробуйте снова`,
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
