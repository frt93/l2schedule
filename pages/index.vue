<template>
  <div>
    <RaidBossesList :displayType="'viewGrid'"></RaidBossesList>
  </div>
</template>

<script>
import RaidBossesList from "~/components/RaidBoss/RaidBossesList";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "applicationMainPage",
  components: {
    RaidBossesList
  },

  data() {
    return {
      time: this.$moment(new Date())
        .utc()
        .format("MMMM DD YYYY, H:mm:ss"),
      time2: "",
      isMoscow: ""
    };
  }
  // async fetch({ store, params }) {
  //   await store.dispatch("raidbosses/fetch");
  // },
  // computed: {
  //   parseGmt() {
  //     return this.$defineGMT(this.$moment(), this.isMoscow);
  //   },
  //   ...mapGetters({ isSetTimeToMoscow: "datetime/isSetTimeToMoscow" })
  // },

  // watch: {
  //   isMoscow(newVal, oldVal) {
  //     this.$store.commit("datetime/isSetTimeToMoscow", newVal);
  //   }
  // },

  // created() {
  //   this.isMoscow = this.isSetTimeToMoscow;
  // }
};
</script>