<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <div class="modal-card-title">
        <span>Изменить информацию о предмете</span>
        <span class="item-fullname" @click="$emit('copy')">{{item.fullname}}</span>
      </div>
    </header>
    <edit :item="item" :action="'update'" @update="update"></edit>
  </div>
</template>

<script>
import edit from "./form";
export default {
  name: "editItem",
  components: {
    edit
  },
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    update(item) {
      this.$axios
        .post(`/item/${item.id}/update`, item)
        .then(async res => {
          await this.$store.dispatch("items/update", item);
          this.$emit("updated", item);
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
            queue: false
          });
        });
    }
  }
};
</script>
