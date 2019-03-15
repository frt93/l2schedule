<template>
  <section class="section">
    <div class="container">
      <div class="columns tile is-ancestor">
        <RaidBoss v-for="(boss, index) in raidBosses" :key="index" :boss="boss"></RaidBoss>
      </div>
    </div>
  </section>
</template>

<script>
import RaidBoss from "./RaidBoss.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    RaidBoss
  },
  computed: {
    ...mapGetters({ raidBosses: "raidboss/getAllRaidBosses" })
  }
};
</script>

<style>
.subtitle.account {
  font-size: 0.85rem;
}

.rb-fullname,
article.tile {
  cursor: pointer;
}

.columns {
  grid-template-columns: repeat(4, 1fr);
  display: grid !important;
}

.image.level {
  align-items: center;
  display: flex;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 0;
  justify-content: center;
  font-size: 20px;
}
</style>

