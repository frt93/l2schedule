<template>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">
          <span>Изменить информацию о предмете</span>
          <span class="item-fullname" @click="$emit('copy')">{{item.fullname}}</span>
        </p>
      </div>
    </div>
    <div class="content">
      <edit :item="item" :action="'update'" @update="update" @back="$emit('updated', item)"></edit>
    </div>
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
      this.$store
        .dispatch(`items/update`, item)
        .then(res => {
          this.$snackbar.open({
            message: res.data.message,
            duration: 5000,
            queue: false
          });
          this.$emit("updated", item);
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
