<template>
  <div>
    <div class="modal-card" v-if="edit==false">
      <header class="modal-card-head">
        <div class="modal-card-title">
          <span
            class="rb-fullname"
            @click="$emit('copy', `Имя РБ ${boss.fullname} скопировано`)"
          >{{boss.fullname}}</span>
        </div>
      </header>
      <section class="modal-card-body">
        <b-field label="Аккаунт палилки" v-if="boss.account">
          <div>
            <b-tooltip label="Нажми, чтобы скопировать" position="is-right" type="is-dark" animated>
              <a
                @click="$emit('copy', `Логин аккаунта ${boss.account} с палилкой скопирован`)"
              >@{{boss.account}}</a>
            </b-tooltip>
          </div>
        </b-field>
        <b-field label="Статы">
          <div>
            <p>Уровень: {{boss.lvl}}</p>
            <p>HP: {{boss.hp}}</p>
            <p>P. Atk: {{boss.p_atk}}</p>
            <p>P. Def: {{boss.p_def}}</p>
            <p>M. Atk: {{boss.m_atk}}</p>
            <p>M. Def: {{boss.m_def}}</p>
          </div>
        </b-field>
        <b-field label="Время последнего спаленного фарма">
          <p>{{composeTodMessage}}</p>
        </b-field>
        <b-field label="Окно респа рб">
          <p>{{composeRespawnRangeMessage}}</p>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-info" type="button" @click="edit=true">Изменить</button>
      </footer>
    </div>
    <editBoss
      v-if="edit==true"
      :boss="boss"
      @back="edit=false"
      @copy="$emit('copy',boss.fullname, 'Имя рб скопировано')"
    ></editBoss>
  </div>
</template>

<script>
import editBoss from "./edit";
import { mapGetters } from "vuex";
export default {
  components: {
    editBoss
  },
  data() {
    return {
      edit: false,
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
    defGMT() {
      return this.$defineGMT(this.boss.tod, this.isSetTimeToMoscow).format(
        "D.MM.YYYY в HH:mm:ss"
      );
    },
    composeTodMessage() {
      let response;
      this.isSetTimeToMoscow
        ? (response = `${this.defGMT} по МСК (GMT +3)`)
        : (response = `${this.defGMT}`);
      return response;
    },
    composeRespawnRangeMessage() {
      return this.$composeTimeRangeFormat(
        this.boss.respawn_start,
        this.boss.respawn_end,
        this.isSetTimeToMoscow
      );
    }
  },
  methods: {
    success(label) {
      this.$toast.open({
        message: `${label}`,
        type: "is-success",
        duration: 3000
      });
    }
  },
  created() {
    this.isMoscow = this.isSetTimeToMoscow;
  }
};
</script>