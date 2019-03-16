<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <div class="modal-card-title">
        <span>Изменить информацию о</span>
        <span class="rb-fullname" @click="$emit('copy')">{{boss.fullname}}</span>
      </div>
    </header>
    <RBform :boss="boss" :page="'edit'" @back="$emit('back')" @saveBoss="saveBoss"></RBform>
  </div>
</template>

<script>
import RBform from "~/components/ui/raidbossForm";
export default {
  components: {
    RBform
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
    saveBoss(boss) {
      //Переводим экземпляр даты в инстанс moment.js
      boss.tod = this.$moment(boss.tod)
        .utc()
        .format();
      //Вычисляем дату начала окна респа
      boss.respawn_start = this.$moment(boss.tod)
        .add(boss.min_respawn, "minutes")
        .utc()
        .format();
      //Вычисляем дату конца окна респа
      boss.respawn_end = this.$moment(boss.tod)
        .add(boss.max_respawn, "minutes")
        .utc()
        .format();
      if (!boss.isSA) {
        boss.sa = [];
        boss.enchantConditions = "";
      }
      this.$axios
        .post(`/rb/${boss.fullname}/save`, boss)
        .then(async res => {
          await this.$store.dispatch("raidboss/editRaidBoss", res.data);
          this.$emit("back");
        })
        .catch(err => {
          this.errors = [];
          this.errors.push(err.response);
        });
    }
  }
};
</script>