<template>
  <form class="raidboss" method="POST">
    <b-field label="Полное имя рб">
      <b-input
        placeholder="Полное имя рб"
        v-model="fullname"
        :disabled="user.privileges!=='master'"
      ></b-input>
    </b-field>
    <b-field label="Короткое имя рб">
      <b-input
        placeholder="Короткое имя рб"
        v-model="shortname"
        :disabled="user.privileges!=='master'"
      ></b-input>
    </b-field>
    <b-field label="Аккаунт палилки" v-if="action === 'edit'">
      <b-input
        placeholder="Аккаунт с палилкой на рб"
        v-model="account"
        :disabled="user.privileges!=='master'"
      ></b-input>
    </b-field>
    <b-field label="Время смерти (ПО ВАШЕМУ ЧАСОВОМУ ПОЯСУ!)" v-if="action === 'edit'">
      <b-tooltip
        class="datepicker-tooltip"
        :label="datepickerTooltipLabel"
        position="is-bottom"
        type="is-dark"
        multilined
        animated
        size="is-large"
      >
        <date-picker v-model="tod" lang="ru" type="datetime" format="DD.MM.YYYY [в] HH:mm"></date-picker>
      </b-tooltip>
    </b-field>
    <b-field label="Минимальное время респа">
      <b-input
        type="number"
        placeholder="Укажите время в МИНУТАХ(!)"
        v-model="min_respawn"
        :disabled="user.privileges!=='master'"
      ></b-input>
    </b-field>
    <b-field label="Максимальное время респа">
      <b-input
        type="number"
        placeholder="Укажите время в МИНУТАХ(!)"
        v-model="max_respawn"
        :disabled="user.privileges!=='master'"
      ></b-input>
    </b-field>
    <b-field label="Статы"></b-field>
    <b-field>
      <div class="form-stats">
        <b-tooltip label="Уровень рб" position="is-bottom" type="is-dark" animated>
          <b-input
            type="number"
            placeholder="Уровень РБ"
            v-model="lvl"
            :disabled="user.privileges!=='master'"
          ></b-input>
        </b-tooltip>
        <b-tooltip label="Физ. Атака" position="is-bottom" type="is-dark" animated>
          <b-input
            type="number"
            placeholder="P.Atk"
            v-model="p_atk"
            :disabled="user.privileges!=='master'"
          ></b-input>
        </b-tooltip>
        <b-tooltip label="Физ. Защита" position="is-bottom" type="is-dark" animated>
          <b-input
            type="number"
            placeholder="P.Def"
            v-model="p_def"
            :disabled="user.privileges!=='master'"
          ></b-input>
        </b-tooltip>
        <b-tooltip label="Маг. Атака" position="is-bottom" type="is-dark" animated>
          <b-input
            type="number"
            placeholder="M.Atk"
            v-model="m_atk"
            :disabled="user.privileges!=='master'"
          ></b-input>
        </b-tooltip>
        <b-tooltip label="Маг. Защита" position="is-bottom" type="is-dark" animated>
          <b-input
            type="number"
            placeholder="M.Def"
            v-model="m_def"
            :disabled="user.privileges!=='master'"
          ></b-input>
        </b-tooltip>
        <b-tooltip label="Кол-во ХП у рб" position="is-bottom" type="is-dark" animated>
          <b-input
            type="number"
            placeholder="HP"
            v-model="hp"
            :disabled="user.privileges!=='master'"
          ></b-input>
        </b-tooltip>
      </div>
    </b-field>
    <b-field label="Дроп цельных вещей">
      <b-taginput
        name="items"
        :disabled="user.privileges!=='master'"
        v-model="fulldrop"
        :data="filteredFulldrop"
        autocomplete
        field="fullname"
        type="is-dark"
        placeholder="Добавить цельный дроп"
        @typing="getFilteredFullDrop"
      >
        <template slot-scope="props">
          <img class="drop-image" :src="`${props.option.image}`">
          <div class="drop-item-name">{{props.option.fullname}}</div>
        </template>
        <template slot="empty">Нет шмота с таким наименованием</template>
      </b-taginput>
    </b-field>
    <b-field label="Дроп кусков или расходников">
      <b-taginput
        name="piecesAndConsumables"
        :disabled="user.privileges!=='master'"
        v-model="piecesAndConsumables"
        :data="filteredPiecesAndConsumables"
        autocomplete
        field="fullname"
        type="is-dark"
        placeholder="Добавить куски или расходники"
        @typing="getFilteredPiecesAndConsumables"
      >
        <template slot-scope="props">
          <img class="drop-image" :src="`${props.option.image}`">
          <div class="drop-item-name">{{props.option.fullname}}</div>
        </template>
        <template slot="empty">Нет кусков или расходников с таким наименованием</template>
      </b-taginput>
    </b-field>
    <b-field label="Soul Crystals качаются?">
      <b-checkbox
        :disabled="user.privileges!=='master'"
        v-model="isSA"
        type="is-success"
      >{{ isEncahntSA }}</b-checkbox>
    </b-field>
    <b-field>
      <b-taginput
        v-if="isSA"
        name="SA"
        :disabled="user.privileges!=='master'"
        v-model="soulCrystals"
        :data="filteredSoulCrystals"
        autocomplete
        field="fullname"
        type="is-dark"
        placeholder="Добавить SA"
        @typing="getFilteredSoulCrystals"
      >
        <template slot-scope="props">
          <img class="drop-image" :src="`${props.option.image}`">
          <div class="drop-item-name">{{props.option.fullname}}</div>
        </template>
        <template slot="empty">Такого рода прокачки СА нет</template>
      </b-taginput>
    </b-field>
    <b-field v-if="isSA">
      <b-input
        type="text"
        placeholder="Условия прокачки Soul Crystals"
        v-model="soulCrystalEnchantConditions"
        :disabled="user.privileges!=='master'"
      ></b-input>
    </b-field>
    <b-field label="Тип рб"></b-field>
    <b-field>
      <b-radio
        :disabled="user.privileges!=='master'"
        v-model="type"
        native-value="regular"
        type="is-dark"
      >Обычный</b-radio>
      <b-radio
        :disabled="user.privileges!=='master'"
        v-model="type"
        native-value="epic"
        type="is-danger"
      >Эпик</b-radio>
    </b-field>
    <div class="level">
      <div class="level-left">
        <button
          v-if="action === 'edit'"
          class="button is-danger"
          type="button"
          @click="$emit('back', $event)"
        >Назад</button>
      </div>
      <div class="level-right">
        <button
          v-if="action ==='edit'"
          class="button is-success"
          type="button"
          @click="$emit('update', composeBossData())"
        >Сохранить</button>
        <button
          v-if="action ==='create'"
          class="button is-success"
          type="button"
          @click="$emit('create', composeBossData())"
        >Создать</button>
      </div>
    </div>
  </form>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "raidBossesForm",
  data() {
    return {
      interval: null,
      tooltipTime: {
        ifMinuteAgo: "",
        ifMsk: "",
        rightTime: ""
      },
      id: this.boss.id,
      // Пременные, которые хранят отсортированные по своему виду предметы, которые отображаются
      // в выпадающем списке при вводе наименования в инпутах. Заполняются данными при срабатывании
      // функций get${название переменной} при всплывающем событии @typing на соответствующих инпутах
      filteredFulldrop: [],
      filteredPiecesAndConsumables: [],
      filteredSoulCrystals: [],

      //Переменные, в которые записываются выбранные предметы
      fulldrop: this.$getFulldrop(this.boss.drop), // цельный дроп
      piecesAndConsumables: this.$getPiecesAndConsumables(this.boss.drop), // куски и расходники
      soulCrystals: this.$getSoulCrystals(this.boss.drop), // Варианты прокачки SA

      isSA: this.$getSoulCrystals(this.boss.drop).length ? true : false,
      soulCrystalEnchantConditions: this.boss.soulCrystalEnchantConditions,
      fullname: this.boss.fullname,
      shortname: this.boss.shortname,
      account: this.boss.account,
      min_respawn: this.boss.min_respawn,
      max_respawn: this.boss.max_respawn,
      tod: this.$moment.unix(this.boss.tod).format(),
      lvl: this.boss.lvl,
      hp: this.boss.hp,
      p_atk: this.boss.p_atk,
      p_def: this.boss.p_def,
      m_atk: this.boss.m_atk,
      m_def: this.boss.m_def,
      type: this.boss.type
    };
  },
  props: {
    boss: {
      type: Object,
      required: true
    },
    action: {
      type: String,
      required: true
    }
  },
  methods: {
    // При вводе текста в инпуты с перечнем дропа, функция фильтрует при помощи глобального метода filterByFullAndShortNames
    // все существующие итемы (предварительно выбрав из них только цельный дроп при помощи глобального метода getFulldrop)
    // и возвращает в свойство data.filteredFulldrop только те, в наименовании (полном или коротком) которых имеется введенный текст.
    // Содержимое свойства data.filteredFulldrop и отображается в выпадающем списке
    getFilteredFullDrop(value) {
      const fulldrop = this.$getFulldrop(this.items);
      this.filteredFulldrop = this.$filterByFullAndShortNames(fulldrop, value);
    },

    // По аналогии с getFilteredFullDrop
    // (но фильтруется только по полному наименованию предмета, т.к. у кусков и расходников нет сокращенного наименования)
    getFilteredPiecesAndConsumables(value) {
      const piecesAndConsumables = this.$getPiecesAndConsumables(this.items);
      this.filteredPiecesAndConsumables = this.$filterByFullAndShortNames(
        piecesAndConsumables,
        value
      );
    },

    // По аналогии с getFilteredFullDrop
    getFilteredSoulCrystals(value) {
      const soulCrystals = this.$getSoulCrystals(this.items);
      this.filteredSoulCrystals = this.$filterByFullAndShortNames(
        soulCrystals,
        value
      );
    },
    //Функция, которые "оживляют" время в тултипе для datetimepicker'a
    liveClock() {
      if (this.action === "edit") {
        this.interval = setInterval(() => {
          this.tooltipTime.ifMinuteAgo = this.$defineGMT(
            this.$moment()
              .subtract(1, "minute")
              .unix(),
            "false"
          ).format("D.MM.YYYY в HH:mm");
          this.tooltipTime.ifMsk = this.$defineGMT(
            this.$moment()
              .subtract(77, "minute")
              .unix(),
            "true"
          ).format("D.MM.YYYY в HH:mm");
          this.tooltipTime.rightTime = this.$defineGMT(
            this.$moment()
              .subtract(77, "minute")
              .unix(),
            "false"
          ).format("D.MM.YYYY в HH:mm");
        }, 1000);
      }
    },

    composeBossData() {
      let boss = {
        fullname: this.fullname,
        shortname: this.shortname,
        min_respawn: this.min_respawn,
        max_respawn: this.max_respawn,
        type: this.type
      };
      // При создании рб присваиваем ему id
      boss.id =
        this.id !== null ? this.id : (boss.id = `${this.$moment().unix()}`);

      //Вычисляем дату начала окна респа и переводим в формат unix
      boss.respawn_start = `${this.$moment(this.tod)
        .add(this.min_respawn, "minutes")
        .unix()}`;
      //Вычисляем дату конца окна респа и переводим в формат unix
      boss.respawn_end = `${this.$moment(this.tod)
        .add(this.max_respawn, "minutes")
        .unix()}`;
      // Время смерти переписываем в формат unix в последнюю очередь,
      // т.к. окно респа высчитывались на основе его значения до перевода в unix
      boss.tod = `${this.$moment(this.tod).unix()}`;

      if (this.action === "edit") boss.account = this.account;
      if (this.lvl) boss.lvl = this.lvl;
      if (this.hp) boss.hp = this.hp;
      if (this.p_atk) boss.p_atk = this.p_atk;
      if (this.p_def) boss.p_def = this.p_def;
      if (this.m_atk) boss.m_atk = this.m_atk;
      if (this.m_def) boss.m_def = this.m_def;
      if (
        this.fulldrop.length ||
        this.piecesAndConsumables.length ||
        this.soulCrystals.legth
      )
        boss.drop = [];

      // Т.к. получаемые с рб цельный дроп/куски/расходники/са хранятся массивами в разных переменных
      // нам необходимо перебрать их и каждый итем из всех 3 переменных поместить в один массив свойства drop
      if (this.fulldrop.length) {
        this.fulldrop.filter(i => {
          return boss.drop.push(i);
        });
      }
      if (this.piecesAndConsumables.length) {
        this.piecesAndConsumables.filter(i => {
          return boss.drop.push(i);
        });
      }

      if (this.soulCrystals.length && this.isSA) {
        this.soulCrystals.filter(i => {
          return boss.drop.push(i);
        });
        boss.soulCrystalEnchantConditions = this.soulCrystalEnchantConditions;
      }
      if (boss.drop) boss.drop = this.$sortByFullname(boss.drop);
      return boss;
    }
  },

  computed: {
    // Получаем массив всех существующих в базе данных предметов
    ...mapGetters({ items: "items/getAll", user: "user/getUser" }),

    // Компонуем содержимое тултипа для datetimepicker'a
    datepickerTooltipLabel() {
      return `Указывай время согласно своему часовому поясу. Например: если рб убили минуту назад - укажи ${
        this.tooltipTime.ifMinuteAgo
      }. Если рб убили ${this.tooltipTime.ifMsk} по МСК, то укажи ${
        this.tooltipTime.rightTime
      }. Надеюсь, ты не долбаеб и все просек`;
    },
    isEncahntSA() {
      return this.isSA == true ? "Да, качаются" : "Нет";
    }
  },

  mounted() {
    this.liveClock();
  },
  beforeCreate() {
    this.$store.dispatch("items/fetch");
  },

  beforeDestroy() {
    if (this.action === "edit") {
      clearInterval(this.interval);
    }
  }
};
</script>

<style>
.modal-form {
  padding: 0;
}

.form-stats input {
  margin-bottom: 10px;
}

.datepicker-tooltip {
  width: 100%;
}

.drop-image {
  float: left;
}
.drop-item-name {
  line-height: 32px;
  float: left;
  padding-left: 10px;
}
.dropdown-item {
  padding-right: 0 !important;
}

.mx-time-list {
  width: 50% !important;
  margin: 0 !important;
}

.mx-datepicker {
  width: 100% !important;
}

.mx-datepicker .mx-panel.mx-panel-time ul:nth-child(3) {
  display: none !important;
}
</style>
