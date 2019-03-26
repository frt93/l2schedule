<template>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">
          <span>Изменить информацию о</span>
          <span class="rb-fullname" @click="$emit('copy')">{{boss.fullname}}</span>
        </p>
      </div>
    </div>
    <div class="content">
      <edit :boss="boss" :action="'edit'" @back="$emit('back')" @update="update"></edit>
    </div>
  </div>
</template>

<script>
import edit from "./form";
export default {
  name: "editRaidBoss",
  components: {
    edit
  },
  data() {
    return {};
  },
  props: {
    boss: {
      type: Object,
      required: true
    }
  },
  methods: {
    update(boss) {
      this.$axios
        .post(`/rb/${boss.id}/update`, boss)
        .then(async res => {
          await this.$store.dispatch("raidbosses/update", boss);
          this.$emit("updated", boss);
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