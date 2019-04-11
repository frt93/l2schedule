<template>
  <div class="container">
    <div class="level">
      <div class="level-left"></div>
      <div class="level-right">
        <a
          class="button is-success"
          @click="isModalActive = true; modalAction = 'create'"
        >Добавить рб</a>
      </div>
    </div>

    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" :canCancel="['x', 'outside']">
      <modal :initialAction="modalAction"></modal>
    </b-modal>

    <RaidBossesList displayType="tabular"></RaidBossesList>
  </div>
</template>

<script>
import RaidBossesList from "~/components/RaidBoss/RaidBossesList";
import modal from "~/components/RaidBoss/modal";
import { mapGetters } from "vuex";
export default {
  name: "dashboardRaidbossesPage",
  middleware: "auth",
  components: { RaidBossesList, modal },
  data() {
    return {
      modalAction: null,
      isModalActive: false
    };
  },
  computed: {
    ...mapGetters({ displayType: "user/getRaidbossesDisplayType" })
  }
};
</script>