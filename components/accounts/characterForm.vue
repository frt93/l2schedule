<template>
  <form class="account" method="POST">
    <b-field label="Никнейм">
      <b-input placeholder="Никнейм персонажа" v-model="nickname" required></b-input>
    </b-field>
    <!-- <b-field label="Персонаж основной на аккаунте?" v-if="account.type==='watcher'">
            <b-checkbox v-model="isBasic">{{ isBasic }}</b-checkbox>
    </b-field>-->
    <b-field label="Профессия" v-if="account.type!=='trader' && account.type!=='watcher'">
      <b-select placeholder="Профессия персонажа" class="profession" v-model="profession">
        <option
          v-for="(profession,index) in professions"
          :key="index"
          :value="profession.value"
        >{{profession.value}}</option>
      </b-select>
    </b-field>
    <span id="trader-section" v-if="account.type==='trader'">
      <b-field label="Тип торговой лавки">
        <div class="block">
          <b-radio v-model="shopType" native-value="wtb">Покупка</b-radio>
          <b-radio v-model="shopType" native-value="wts">Продажа</b-radio>
        </div>
      </b-field>

      <b-field label="Предметы на трейде">
        <b-autocomplete
          ref="items"
          :data="filteredItems"
          placeholder="Введите наименование предмета"
          field="fullname"
          @typing="filterItems($event); isFetching = true"
          @select="option => addItem(option)"
        >
          <template slot-scope="props">
            <div class="media">
              <div class="media-left">
                <img :src="props.option.image">
              </div>
              <div class="media-content">
                {{ props.option.fullname }}
                <img
                  v-if="props.option.grade"
                  :src="`/items/grade/${props.option.grade}.gif`"
                >
                <br>
                <small>{{props.option.type}}</small>
              </div>
            </div>
          </template>
        </b-autocomplete>
      </b-field>

      <b-field>
        <table class="table">
          <tbody>
            <td class="items">
              <tr class="row" v-for="item in items" :key="item.name">
                <td class="item-image">
                  <img :src="item.image" :alt="item.name">
                </td>
                <td class="item-name clearfix">{{item.name}}</td>
                <td class="item-price clearfix">
                  <b-tooltip
                    label="Цена за единицу товара"
                    position="is-bottom"
                    type="is-dark"
                    animated
                  >
                    <b-input
                      type="number"
                      placeholder="Цена за единицу"
                      v-model="item.price"
                    >{{item.price}}</b-input>
                  </b-tooltip>
                </td>
                <td class="item-quantity clearfix">
                  <b-tooltip
                    label="Количество предметов на трейде"
                    position="is-bottom"
                    type="is-dark"
                    animated
                  >
                    <b-input
                      type="number"
                      placeholder="Количество предметов"
                      v-model="item.quantity"
                    >{{item.quantity}}</b-input>
                  </b-tooltip>
                </td>
                <td>
                  <span class="manage-icons">
                    <b-tooltip
                      label="Убрать предмет из списка"
                      position="is-bottom"
                      type="is-dark"
                      animated
                    >
                      <i class="mdi mdi-delete remove" @click="removeItem(item)"></i>
                    </b-tooltip>
                  </span>
                </td>
              </tr>
            </td>
          </tbody>
        </table>
      </b-field>
    </span>
    <span id="watcher-section">
      <b-field label="Что будем палить?" v-if="account.type==='watcher'">
        <b-input placeholder="Цель наблюдения" v-model="watchFor"></b-input>
      </b-field>
    </span>
    <br>
    <div class="level">
      <div class="level-left"></div>
      <div class="level-right">
        <button
          class="button is-success"
          type="button"
          v-if="action==='add'"
          @click="$emit('add', composeCharacterData())"
        >Добавить</button>
        <button
          class="button is-success"
          type="button"
          v-if="action==='edit'"
          @click="$emit('edit', composeCharacterData())"
        >Сохранить</button>
      </div>
    </div>
  </form>
</template>

<script>
import { mapGetters } from "vuex";
import debounce from "lodash/debounce";

export default {
  name: "manageCharacterForm",
  data() {
    return {
      id: this.account.id,
      isBasic: this.account.type !== "watcher" ? true : false, // Является ли создаваемый персонаж основным на аккаунте. Если на момент создания на аккаунте уже имеется персонаж с таким статусом - он его потеряет.
      nickname: this.character.nickname,
      profession: this.character.profession,
      shopType: this.character.shopType, // Для
      items: this.character.items, // трейдеров
      filteredItems: [],
      watchFor: this.character.watchFor, // Для палилок. В ней содержится название объекта наблюдения
      professions: []
    };
  },
  props: {
    account: {
      type: Object,
      required: true
    },
    character: {
      type: Object,
      required: false
    },
    action: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({ allItems: "items/getAll" })
  },
  methods: {
    filterItems: debounce(function(value) {
      this.filteredItems = [];
      if (!value.length) {
        // Условие срабатывает если поисковое поле было полностью очищено.
        // Соответственно поисковый запрос не задан.
        this.filteredItems = [];
        return;
      }
      const items = this.allItems.filter(item => {
        return (
          this.$toLowerCaseAndReplaceSpaces(item.fullname).indexOf(
            this.$toLowerCaseAndReplaceSpaces(value)
          ) >= 0
        );
      });
      items.forEach(item => {
        this.filteredItems.push(item);
      });
      this.isFetching = false;
    }, 500),

    /**
     * Добавляем выбранный предмет в массив предметов, выставленных на продажу/покупку
     *
     * @param item              Выбранный предмет
     */
    addItem(item) {
      if (!item) {
        this.filteredItems = [];
        return;
      }

      this.$nextTick(function() {
        this.$refs.items.newValue = "";
      });

      let oneMoreItem = {};
      oneMoreItem.name = item.fullname;
      oneMoreItem.image = item.image;
      oneMoreItem.price = null;
      oneMoreItem.quantity = null;

      this.items.push(oneMoreItem);
    },
    /**
     * Удлаяем предмет из массива выбранных предметов, выставленных на продажу/покупку
     *
     * @param item              Выбранный предмет
     */
    removeItem(item) {
      const itemsToKeepBack = this.items.filter(i => {
        return i.name !== item.name;
      });

      this.items = itemsToKeepBack;
    },

    composeCharacterData() {
      let newCharacter = {
        id: this.character.id,
        isBasic: this.isBasic,
        nickname: this.nickname,
        profession: this.profession
      };

      if (this.action === "add") {
        newCharacter.id = `${this.$moment().unix()}`;
      }

      if (this.account.type === "trader") {
        newCharacter.shopType = this.shopType;
        newCharacter.items = this.items;
      }
      if (this.account.type === "watcher") {
        newCharacter.watchFor = this.watchFor;
      }
      return newCharacter;
    }
  },
  beforeMount() {
    if (this.account.type !== "trader" && this.account.type !== "watcher")
      this.$axios
        .get("/accounts/professions")
        .then(res => {
          this.professions = res.data;
        })
        .catch(e => {
          console.log(e);
        });
  }
};
</script>

<style scoped>
.profession .select,
.select > select {
  width: 100%;
}

td.items > tr > td:not(:last-child, .item-image) {
  padding-right: 10px;
}

tr.row {
  width: 100%;
}
.manage-icons {
  visibility: inherit;
  -webkit-animation: none !important;
  animation: none !important;
}
.manage-icons .remove {
  line-height: 36px;
}
</style>