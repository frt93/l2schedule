<template>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">Добавить новый предмет</p>
      </div>
    </div>
    <div class="content">
      <create :item="item" :action="'create'" @create="create"></create>
    </div>
  </div>
</template>
<script>
import create from "./form";
export default {
  name: "createItem",
  components: {
    create
  },
  data() {
    return {
      item: {
        id: null,
        fullname: "",
        shortname: "",
        image: null,
        grade: "",
        type: "", //full or piece
        kind: "" // weapon, armor, jewerly etc.
      }
    };
  },
  methods: {
    create(item) {
      item.id = `${this.$moment().unix()}`;

      this.$axios
        .post("/item/create", item)
        .then(res => {
          this.$emit("created", item);
          this.$store.commit("items/add", item);
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