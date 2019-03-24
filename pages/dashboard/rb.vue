<template>
  <div>
    <n-link to="/">Главная</n-link>
    <n-link to="/dashboard/">ПУ</n-link>
    <n-link to="/dashboard/items">Предметы</n-link>
    <a class="button is-success" @click="isModalActive = true; modalAction = 'create'">Добавить рб</a>
    <b-modal :active.sync="isModalActive">
      <modal :initialAction="modalAction"></modal>
    </b-modal>

    <div class="container">
      <RaidBossesList displayType="rbTable"></RaidBossesList>
    </div>
  </div>
</template>

<script>
import RaidBossesList from "~/components/RaidBoss/RaidBossesList";
import modal from "~/components/RaidBoss/modal";
export default {
  components: { RaidBossesList, modal },
  data() {
    return {
      modalAction: null,
      isModalActive: false
    };
  },

  async fetch({ store, params }) {
    await store.dispatch("raidbosses/fetch");
  }
};
</script>
