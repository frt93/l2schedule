<template>
  <div>
    <p>1:{{time}}</p>
    <div>
      <b-checkbox
        v-model="isMoscow"
        :true-value="true"
        :false-value="false"
      >По Москве?: {{ isMoscow }}</b-checkbox>
    </div>
    {{parseGmt}}
    <div>
      <p>from data:{{isMoscow}}</p>
      <p>from store: {{isSetTimeToMoscow}}</p>
    </div>
    <div @click="displayType = 'rbGrid'">
      <b-icon icon="view-grid" size="is-medium"></b-icon>
    </div>
    <div @click="displayType = 'rbTable'">
      <b-icon icon="format-list-bulleted" size="is-medium"></b-icon>
    </div>
    <RaidBossesList :displayType="displayType"></RaidBossesList>
  </div>
</template>

<script>
import RaidBossesList from "~/components/RaidBoss/RaidBossesList";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    RaidBossesList
  },
  async fetch({ store, params }) {
    await store.dispatch("raidbosses/fetch");
  },

  data() {
    return {
      time: this.$moment(new Date())
        .utc()
        .format("MMMM DD YYYY, H:mm:ss"),
      time2: "",
      isMoscow: "",
      displayType: "rbGrid"
    };
  },

  computed: {
    parseGmt() {
      return this.$defineGMT(this.$moment(), this.isMoscow);
    },
    ...mapGetters({ isSetTimeToMoscow: "datetime/isSetTimeToMoscow" })
  },

  watch: {
    isMoscow(newVal, oldVal) {
      this.$store.commit("datetime/isSetTimeToMoscow", newVal);
    }
  },

  created() {
    this.isMoscow = this.isSetTimeToMoscow;
  }
};
</script>