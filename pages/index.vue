<template>
  <div>
    <RaidBossesList :displayType="displayType"></RaidBossesList>
  </div>
</template>

<script>
import RaidBossesList from "~/components/RaidBoss/RaidBossesList";
import { mapGetters } from "vuex";
export default {
  name: "applicationMainPage",
  middleware: "auth",
  components: {
    RaidBossesList
  },

  computed: {
    ...mapGetters({ displayType: "user/getRaidbossesDisplayType" })
  }
};
</script>