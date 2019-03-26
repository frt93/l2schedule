<template>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">Добавить нового РБ</p>
      </div>
    </div>
    <div class="content">
      <create :boss="boss" :action="'create'" @create="create"></create>
    </div>
  </div>
</template>

<script>
import create from "./form";
export default {
  name: "createRaidBoss",
  components: { create },
  data() {
    return {
      boss: {
        id: null,
        drop: [],
        type: "regular"
      }
    };
  },
  methods: {
    create(boss) {
      this.$axios
        .post("/rb/create", boss)
        .then(res => {
          this.$emit("created", boss);
          this.$store.commit("raidbosses/add", boss);
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
  },

  computed: {
    isEncahntSA() {
      return this.isSA == true ? "Да, качаются" : "Нет";
    }
  }
};
</script>


