<template>
<div>
  <body>
    <!-- <p>1:{{time}}</p>
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
    <RaidBosses></RaidBosses>
  </body> -->
  123
</div>
</template>

<script>
import RaidBosses from "~/components/RaidBoss/RaidBossList.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    RaidBosses: RaidBosses
  },
  // async fetch({ store, params }) {
  //   await store.dispatch("raidboss/fetch");
  // },

  data() {
    return {
      time: this.$moment(new Date())
        .utc()
        .format("MMMM DD YYYY, H:mm:ss"),
      time2: this.parseGmt,
      isMoscow: ""
    };
  },

  computed: {
    parseGmt() {
      return this.$defineGMT(this.$moment(), this.isMoscow);
    },
    ...mapGetters({ isSetTimeToMoscow: "datetime/isSetTimeToMoscow" })
  },

  methods: {
    // differense() {
    //   const b = this.$moment(new Date()); //now
    //   const a = this.$moment().add(36, "hours");
    //   const diff = a.diff(b, "minutes");
    //   if (diff > 60) {
    //     this.time3 = `${a.diff(b, "hours")} часов`;
    //   } else {
    //     this.time3 = `${a.diff(b, "minutes")} минут`;
    //   }
    // }
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