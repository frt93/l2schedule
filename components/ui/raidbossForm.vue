<template>
  <section class="modal-card-body modal-form">
    <form class="raidboss" method="POST">
      <b-field label="Полное имя рб">
        <b-input placeholder="Полное имя рб" v-model="fullname" required></b-input>
      </b-field>
      <b-field label="Короткое имя рб">
        <b-input placeholder="Короткое имя рб" v-model="shortname" required></b-input>
      </b-field>
      <b-field label="Аккаунт палилки">
        <b-input placeholder="Аккаунт с палилкой на рб" v-model="account"></b-input>
      </b-field>
      <b-field label="Время смерти (ПО ВАШЕМУ ЧАСОВОМУ ПОЯСУ!)" v-if="page === 'edit'">
        <no-ssr>
          <b-tooltip
            class="datepicker-tooltip"
            :label="datepickerTooltipLabel"
            position="is-bottom"
            type="is-dark"
            multilined
            animated
            size="is-large"
          >
            <date-picker
              v-model="tod"
              lang="ru"
              type="datetime"
              format="DD.MM.YYYY [в] HH:mm"
              confirm
            ></date-picker>
          </b-tooltip>
        </no-ssr>
      </b-field>
      <b-field label="Минимальное время респа">
        <b-input
          type="number"
          placeholder="Укажите время в МИНУТАХ(!)"
          v-model="min_respawn"
          required
        ></b-input>
      </b-field>
      <b-field label="Максимальное время респа">
        <b-input
          type="number"
          placeholder="Укажите время в МИНУТАХ(!)"
          v-model="max_respawn"
          required
        ></b-input>
      </b-field>
      <b-field label="Статы"></b-field>
      <b-field>
        <div class="form-stats">
          <b-tooltip label="Уровень рб" position="is-bottom" type="is-dark" animated>
            <b-input required type="number" placeholder="Уровень РБ" v-model="lvl"></b-input>
          </b-tooltip>
          <b-tooltip label="Физ. Атака" position="is-bottom" type="is-dark" animated>
            <b-input required type="number" placeholder="P.Att" v-model="p_atk"></b-input>
          </b-tooltip>
          <b-tooltip label="Физ. Защита" position="is-bottom" type="is-dark" animated>
            <b-input required type="number" placeholder="P.Def" v-model="p_def"></b-input>
          </b-tooltip>
          <b-tooltip label="Маг. Атака" position="is-bottom" type="is-dark" animated>
            <b-input required type="number" placeholder="M.Att" v-model="m_atk"></b-input>
          </b-tooltip>
          <b-tooltip label="Маг. Защита" position="is-bottom" type="is-dark" animated>
            <b-input required type="number" placeholder="M.Def" v-model="m_def"></b-input>
          </b-tooltip>
          <b-tooltip label="Кол-во ХП у рб" position="is-bottom" type="is-dark" animated>
            <b-input required type="number" placeholder="HP" v-model="hp"></b-input>
          </b-tooltip>
        </div>
      </b-field>
      <b-field label="Дроп цельных вещей">
        <b-taginput
          name="items"
          v-model="items"
          :data="filteredItems"
          autocomplete
          field="name"
          type="is-dark"
          placeholder="Добавить предмет"
          @typing="getFilteredItems"
        >
          <template slot-scope="props">
            <img class="drop-image" :src="`${props.option.image}`">
            <div class="drop-item-name">{{props.option.name}}</div>
          </template>
          <template slot="empty">There are no items</template>
        </b-taginput>
      </b-field>
      <b-field label="Дроп кусков">
        <b-taginput
          name="pieces"
          v-model="pieces"
          :data="filteredPieces"
          autocomplete
          field="name"
          type="is-dark"
          placeholder="Добавить кусков"
          @typing="getFilteredPieces"
        >
          <template slot-scope="props">
            <img class="drop-image" :src="`${props.option.image}`">
            <div class="drop-item-name">{{props.option.name}}</div>
          </template>
          <template slot="empty">There are no items</template>
        </b-taginput>
      </b-field>
      <b-field label="Soul Crystals качаются?">
        <b-checkbox v-model="isSA" type="is-success">{{ isEncahntSA }}</b-checkbox>
      </b-field>
      <b-field>
        <b-taginput
          v-if="isSA"
          name="SA"
          v-model="sa"
          :data="filteredSa"
          autocomplete
          field="name"
          type="is-dark"
          placeholder="Добавить SA"
          @typing="getFilteredSa"
        >
          <template slot-scope="props">
            <img class="drop-image" :src="`${props.option.image}`">
            <div class="drop-item-name">{{props.option.name}}</div>
          </template>
          <template slot="empty">There are no items</template>
        </b-taginput>
      </b-field>
      <b-field v-if="isSA">
        <b-input
          type="text"
          placeholder="Условия прокачки Soul Crystals"
          v-model="enchantConditions"
        ></b-input>
      </b-field>
      <b-field label="Тип рб"></b-field>
      <b-field>
        <b-radio v-model="type" native-value="regular" type="is-dark">Обычный</b-radio>
        <b-radio v-model="type" native-value="epic" type="is-danger">Эпик</b-radio>
      </b-field>
      {{errors}}
    </form>
    <footer class="modal-card-foot">
      <button
        v-if="page == 'edit'"
        class="button is-danger"
        type="button"
        @click="$emit('back', $event)"
      >Назад</button>
      <button
        v-if="page=='edit'"
        class="button is-success"
        type="button"
        @click="$emit('saveBoss', composeBossData)"
      >Сохранить</button>
      <button
        v-if="page=='add'"
        class="button is-success"
        type="button"
        @click="$emit('addBoss', composeBossData)"
      >Добавить</button>
    </footer>
  </section>
</template>

<script>
const items = require("~/api/db/items/full.json");
const pieces = require("~/api/db/items/pieces.json");
const SA = require("~/api/db/items/sa.json");
export default {
  data() {
    return {
      tooltipTime: {
        ifMinuteAgo: this.ifMinuteAgo(),
        ifMsk: this.ifMsk(),
        rightTime: this.rightTime()
      },
      filteredItems: this.boss.items,
      filteredPieces: this.boss.pieces,
      filteredSa: this.boss.sa,
      items: this.boss.items,
      pieces: this.boss.pieces,
      sa: this.boss.sa,
      isSA: this.boss.isSA,
      enchantConditions: this.boss.enchantConditions,
      fullname: this.boss.fullname,
      shortname: this.boss.shortname,
      account: this.boss.account,
      min_respawn: this.boss.min_respawn,
      max_respawn: this.boss.max_respawn,
      tod: this.boss.tod,
      lvl: this.boss.lvl,
      hp: this.boss.hp,
      p_atk: this.boss.p_atk,
      p_def: this.boss.p_def,
      m_atk: this.boss.m_atk,
      m_def: this.boss.m_def,
      type: this.boss.type,
      errors: ""
    };
  },
  props: {
    boss: {
      type: Object,
      required: true
    },
    page: {
      type: String,
      required: true
    },
    save: {
      type: Boolean
    }
  },
  methods: {
    getFilteredItems(text) {
      this.filteredItems = items.filter(item => {
        return (
          item.name
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        );
      });
    },
    getFilteredPieces(text) {
      this.filteredPieces = pieces.filter(item => {
        return (
          item.name
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        );
      });
    },
    getFilteredSa(text) {
      this.filteredSa = SA.filter(item => {
        return (
          item.name
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        );
      });
    },
    //Функции, которые "оживляют" время в тултипе для datetimepicker'a
    ifMinuteAgo() {
      this.timer1 = setInterval(() => {
        this.tooltipTime.ifMinuteAgo = this.$defineGMT(
          this.$moment().subtract(1, "minute"),
          false
        ).format("D.MM.YYYY в HH:mm:ss");
        console.log("IntervalID");
      }, 1000);
    },
    ifMsk() {
      this.timer2 = setInterval(() => {
        this.tooltipTime.ifMsk = this.$defineGMT(
          this.$moment().subtract(77, "minute"),
          true
        ).format("D.MM.YYYY в HH:mm:ss");
        console.log("IntervalID");
      }, 1000);
    },
    rightTime() {
      this.timer3 = setInterval(() => {
        this.tooltipTime.rightTime = this.$defineGMT(
          this.$moment().subtract(77, "minute"),
          false
        ).format("D.MM.YYYY в HH:mm:ss");
        console.log("IntervalID");
      }, 1000);
    }
  },

  computed: {
    datepickerTooltipLabel() {
      return `Указывай время согласно своему часовому поясу. \n Например: если рб убили минуту назад - укажи ${
        this.tooltipTime.ifMinuteAgo
      }. Если рб убили ${this.tooltipTime.ifMsk} по МСК, то укажи ${
        this.tooltipTime.rightTime
      }. Надеюсь, ты не долбаеб и все просек`;
    },
    isEncahntSA() {
      return this.isSA == true ? "Да, качаются" : "Нет";
    },
    composeBossData() {
      return {
        fullname: this.fullname,
        shortname: this.shortname,
        min_respawn: this.min_respawn,
        max_respawn: this.max_respawn,
        tod: this.tod,
        respawn_start: this.respawn_start,
        respawn_end: this.respawn_end,
        account: this.account,
        lvl: this.lvl,
        hp: this.hp,
        p_atk: this.p_atk,
        p_def: this.p_def,
        m_atk: this.m_atk,
        m_def: this.m_def,
        type: this.type,
        items: this.items,
        pieces: this.pieces,
        isSA: this.isSA,
        sa: this.sa,
        enchantConditions: this.enchantConditions
      };
    }
  },

  beforeDestroy() {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
    clearInterval(this.timer3);
  }
};
</script>

<style>
.modal-form {
  padding: 0;
}

form.raidboss {
  padding: 20px;
}

.form-stats input {
  margin-bottom: 10px;
}

.datepicker-tooltip {
  width: 100%;
}
</style>
