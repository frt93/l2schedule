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
        tod: 0,
        type: "regular"
      }
    };
  },
  methods: {
    create(boss) {
      this.$store
        .dispatch("raidbosses/create", boss)
        .then(res => {
          this.$snackbar.open({
            duration: 5000,
            message: `${res.data.message}`,
            type: "is-success",
            position: "is-bottom-right",
            queue: false
          });
          this.$emit("created", res.data.boss);
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
  },

  computed: {
    isEncahntSA() {
      return this.isSA == true ? "Да, качаются" : "Нет";
    }
  }
};
</script>


