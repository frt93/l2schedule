<template>
  <div class="card">
    <viewBoss
      v-if="action === 'view'"
      :boss="boss"
      :timeleftToRespawn="timeleftToRespawn[boss.id]"
      @update="action = 'edit'"
      @copyFullname="$emit('copy', `Имя РБ ${boss.fullname} скопировано`, boss.fullname)"
      @copyAccount="$emit('copy', `Логин аккаунта ${boss.account} с палилкой скопирован`, boss.account)"
    ></viewBoss>
    <editBoss
      v-if="action === 'edit'"
      :boss="boss"
      @updated="newRaidBoss"
      @copy="$emit('copy', `Имя РБ ${boss.fullname} скопировано`, boss.fullname)"
      @back="action = 'view'"
    ></editBoss>
    <createBoss v-if="action === 'create'" @created="newRaidBoss"></createBoss>
  </div>
</template>

<script>
import editBoss from "./edit";
import createBoss from "./create";
import viewBoss from "./view";

export default {
  name: "raidBossModalWindow",
  components: {
    editBoss,
    createBoss,
    viewBoss
  },
  data() {
    return {
      action: this.initialAction,
      boss: this.data
    };
  },
  props: {
    data: {
      type: Object
    },
    initialAction: {
      type: String,
      required: true
    },
    timeleftToRespawn: {
      type: Object
    }
  },

  methods: {
    newRaidBoss(boss) {
      this.boss = boss;
      this.action = "view";
    }
  }
};
</script>

<style>
@media screen and (max-width: 320px) {
  .card .content {
    font-size: 12px;
  }
}
@media screen and (max-width: 768px) {
  .media-content {
    overflow-x: initial;
  }
}
@media screen and (max-width: 1024px) {
  /* .card .content {
    font-size: 12px;
  } */
  .modal-content,
  .modal-card {
    max-height: none;
    max-width: 1024px !important;
  }
  .delete::before,
  .modal-close::before,
  .delete::after,
  .modal-close::after {
    background-color: #adadad;
  }
}

@media screen and (min-width: 1025px) and (max-width: 1600px) {
  .modal-content,
  .modal-card {
    max-width: 900px !important;
  }
}

@media screen and (min-width: 1601px) and (max-width: 1920px) {
  .modal-content,
  .modal-card {
    max-width: 1024px !important;
  }
  .card .content {
    font-size: 16px;
  }
}

@media screen and (min-width: 1921px) {
  .modal-content,
  .modal-card {
    max-width: 1260px !important;
  }
  .card .content {
    font-size: 18px;
  }
}
</style>