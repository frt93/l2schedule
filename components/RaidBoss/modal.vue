<template>
  <div>
    <viewBoss
      v-if="action == 'view'"
      :boss="boss"
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