<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <div class="modal-card-title">
        <span class="rb-fullname" @click="$emit('copyFullname')">{{boss.fullname}}</span>
      </div>
    </header>
    <section class="modal-card-body">
      <b-field label="Аккаунт палилки" v-if="boss.account">
        <div>
          <b-tooltip label="Нажми, чтобы скопировать" position="is-right" type="is-dark" animated>
            <a @click="$emit('copyAccount')">@{{boss.account}}</a>
          </b-tooltip>
        </div>
      </b-field>
      <b-field label="Статы">
        <div>
          <p v-if="boss.lvl">Уровень: {{boss.lvl}}</p>
          <p v-if="boss.hp">HP: {{boss.hp}}</p>
          <p v-if="boss.p_atk">P. Atk: {{boss.p_atk}}</p>
          <p v-if="boss.p_def">P. Def: {{boss.p_def}}</p>
          <p v-if="boss.m_atk">M. Atk: {{boss.m_atk}}</p>
          <p v-if="boss.m_def">M. Def: {{boss.m_def}}</p>
        </div>
      </b-field>
      <b-field label="Время последнего спаленного фарма">
        <p>{{composeTodMessage}}</p>
      </b-field>
      <b-field label="Окно респа рб">
        <p>{{composeRespawnWindowMessage}}</p>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-info" type="button" @click="$emit('update')">Изменить</button>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "viewRaidBoss",
  data() {
    return {
      isMoscow: ""
    };
  },
  props: {
    boss: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({ isSetTimeToMoscow: "datetime/isSetTimeToMoscow" }),
    todTime() {
      return this.$defineGMT(this.boss.tod, this.isSetTimeToMoscow).format(
        "D.MM.YYYY в HH:mm"
      );
    },
    composeTodMessage() {
      let response;
      this.isSetTimeToMoscow
        ? (response = `${this.todTime} по МСК (GMT +3)`)
        : (response = `${this.todTime}`);
      return response;
    },
    composeRespawnWindowMessage() {
      return this.$timeRange(
        this.boss.respawn_start,
        this.boss.respawn_end,
        this.isSetTimeToMoscow
      );
    }
  },
  created() {
    this.isMoscow = this.isSetTimeToMoscow;
  }
};
</script>