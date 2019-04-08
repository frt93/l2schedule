<template>
  <section>
    <div class="block search">
      <div class="block search-key">
        <b-dropdown v-model="searchBy" aria-role="list" @change="keyChanged">
          <span class="select-key" type="button" slot="trigger">
            <template v-if="searchBy">
              <span class="key-label">{{searchKeyLabel}}</span>
            </template>
            <b-icon icon="menu-down"></b-icon>
          </span>

          <b-dropdown-item :value="'name'" aria-role="listitem">
            <div class="media">
              <div class="media-content">
                <h3>Поиск по имени РБ</h3>
              </div>
            </div>
          </b-dropdown-item>

          <b-dropdown-item :value="'item'" aria-role="listitem">
            <div class="media">
              <div class="media-content">
                <h3>Поиск по дропу</h3>
              </div>
            </div>
          </b-dropdown-item>

          <b-dropdown-item :value="'sa'" aria-role="listitem">
            <div class="media">
              <div class="media-content">
                <h3>Поиск РБ с качем SA</h3>
              </div>
            </div>
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="block">
        <b-autocomplete
          ref="input"
          :data="filteredOptions"
          :placeholder="placeholder"
          field="fullname"
          size="is-large"
          @typing="getAsyncData"
          @select="option => searchByDrop(option)"
        >
          <template slot-scope="props">
            <div class="media" v-if="searchBy !== 'name'">
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
      </div>
    </div>
  </section>
</template>

<script>
import debounce from "lodash/debounce";
export default {
  name: "searchForm",
  data() {
    return {
      bosses: this.$store.getters["raidbosses/getAll"],
      items: this.$store.getters["items/getAll"],
      filteredOptions: [],
      searchBy: "name",
      results: []
    };
  },
  computed: {
    placeholder() {
      return this.searchBy === "name"
        ? `Введите имя РБ`
        : this.searchBy === "item"
        ? `Введите наименование предмета`
        : `Опишите вариант прокачки СА`;
    },
    searchKeyLabel() {
      return this.searchBy === "name"
        ? `поиск по имени`
        : this.searchBy === "item"
        ? `поиск по дропу`
        : `рб с прокачкой SA`;
    }
  },
  methods: {
    getAsyncData: debounce(function(value) {
      if (!value.length) {
        // Условие срабатывает если поисковое поле было полностью очищено.
        // Соответственно поисковый запрос не задан. Очищаем свойство results.
        // Отправляем наверх пустые массив results и переменную value (пустую), давая понять
        // родительскому компоненту, что можно отобразить первоначальные данные
        this.results = [];
        this.$emit("result", this.results, value);
        return;
      }
      if (this.searchBy === "name") {
        // Поиск по имени РБ. Записываем в свойство results результаты фильтрации
        this.results = this.$filterByFullAndShortNames(this.bosses, value);
        // Если результатов поиска нет - выбрасываем пользователю ошибку
        if (!this.results.length) {
          this.$toast.open({
            message: `РБ с названием "${value}" не найдено`,
            type: "is-danger",
            duration: 5000,
            queue: false
          });
        }
        // Отправляем массив с данными наверх родителю.
        this.$emit("result", this.results, value);
      } else if (this.searchBy === "item") {
        // Поиск рб по дропу. Данный отрезок функции вызывается при вводе названия предмета в поисковое поле
        // Для начала очистим свойство filteredOptions, в котором могут храниться результаты фильтрации предметов
        // с предыдущих поисковых операций
        this.filteredOptions = [];
        // Из списка всех возможных предметов отберем все, кроме SA
        let items = this.items.filter(item => {
          return item.type !== "sa";
        });
        // Полученные путем отбора отфильтруем по введенному в поисковое поле наименованию
        items = this.$filterByFullAndShortNames(items, value);

        // Если результатов поиска/фильтрации нет - выбрасываем пользователю ошибку
        if (!items.length) {
          this.$toast.open({
            message: `Предметов наименованием "${value}" не найдено`,
            type: "is-danger",
            duration: 5000,
            queue: false
          });
        }
        // Если результаты есть - формируем новый массив в свойстве filteredOptions (т.е. компонуем выпадающий список)
        items.forEach(item => this.filteredOptions.push(item));
      } else if (this.searchBy === "sa") {
        // Поиск рб на которых качаются Soul Crystals. Данный отрезок функции вызывается при описании разновидности прокачки в поисковое поле
        // Для начала очистим свойство filteredOptions, в котором могут храниться результаты фильтрации предметов
        // с предыдущих поисковых операций
        this.filteredOptions = [];
        // Снова фильтруем список всех предметов по поисковому запросу
        let crystals = this.items.filter(item => {
          return item.type === "sa";
        });
        crystals = this.$filterByFullAndShortNames(crystals, value);
        // Если результатов поиска/фильтрации нет - выбрасываем пользователю ошибку
        if (!crystals.length) {
          this.$toast.open({
            message: `Варианта прокачки "${value}" не найдено`,
            type: "is-danger",
            duration: 5000,
            queue: false
          });
        }
        // Если результаты есть - формируем новый массив в свойстве filteredOptions (т.е. компонуем выпадающий список)
        crystals.forEach(item => this.filteredOptions.push(item));
      }
    }, 500),

    searchByDrop(item) {
      // Если предмет не выбран из выпадающего списка - очищаем этот список и отключаем "рабочее состояние" компонента
      if (!item) {
        this.filteredOptions = [];
        return;
      }
      // Предмет выбран в выпадающем списке. Очищаем свойства data с результатами поиска (results)
      // и отфильтрованым по названию списком предметов (filteredOptions)
      this.results = [];
      this.filteredOptions = [];
      // Начинаем перебор массива с рб
      this.results = this.bosses.filter(boss => {
        // Для каждого рб переберем его массив дропа и найдем тех, у которых в нем присутствует искомый предмет
        const bossWithItem = boss.drop.filter(i => {
          return (
            i.fullname
              .toString()
              .toLowerCase()
              .indexOf(item.fullname.toLowerCase()) >= 0
          );
        });
        // В переменной bossWithItem возвращаются отфильтрованные массивы дропа.
        // Мы возвращаем родительскому методу filter только те, в которых есть искомый предмет (остальные вернулись пустыми)
        // Соответственно, таким образом родительский метод this.bosses.filter запишет в свойство results только тех рб,
        // поиск по списку дропа которых дал положительный результат
        return bossWithItem.length;
      });
      // Если каким-то чудом поиск не даст результатов - выбросим пользователю ошибку
      if (!this.results.length) {
        const message =
          this.searchBy === "item"
            ? `РБ с дропом "${item.fullname}" не найдены`
            : `РБ с прокачкой "${item.fullname}" не найдены`;
        this.$toast.open({
          message: message,
          type: "is-danger",
          duration: 5000,
          queue: false
        });
      }
      // Отправляем результат родительскому компоненту
      this.$emit("result", this.results, item.fullname);
    },

    getRbWithSA() {
      // Метод вызывается при выборе в качестве ключа поиска вариант с SA. Т.е. ищем рб, на которых качаются SA.
      // Первым делом очищаем свойства data с результатами поиска (results) и отфильтрованым по названию
      // списком предметов (filteredOptions), которые могли остаться от прошлого поискового запроса
      this.results = [];
      this.filteredOptions = [];
      // Начинаем перебор массива с рб
      this.results = this.bosses.filter(boss => {
        // Для каждого рб переберем его массив дропа и найдем тех, у которых в нем присутствует SA
        const bossWithSA = boss.drop.filter(i => {
          return (
            i.type
              .toString()
              .toLowerCase()
              .indexOf("sa") >= 0
          );
        });
        // В переменной bossWithSA возвращаются отфильтрованные массивы дропа.
        // Мы возвращаем родительскому методу filter только те, в которых есть SA.
        // Соответственно, таким образом родительский метод this.bosses.filter запишет в свойство results только тех рб,
        // поиск по списку дропа которых дал положительный результат
        return bossWithSA.length;
      });
      // Если поиск не даст результатов - выбросим пользователю ошибку
      if (!this.results.length) {
        this.$toast.open({
          message: `РБ с прокачкой "Soul Crystals не найдены`,
          type: "is-danger",
          duration: 5000,
          queue: false
        });
      }
      // Отправляем результат родительскому компоненту
      this.$emit("result", this.results, "soul crystals");
    },

    forceSearch(item, key) {
      // Метод вызывается из родительского компонента при клике на предмет или SA в списке дропа РБ.
      // В качестве аргумента получаем наименование предмета с ключом поиска и запускаем метод поиска по дропу.
      this.searchBy = key;
      this.searchByDrop(item);
      // Обращаемся к поисковому инпуту и записываем в него наименование предмета.
      // Делаем это через $nextTick т.к. при первичной отрисовке и вставке в DOM нет доступа к содержимому
      // this.$el. Свойство $nextTick позволяет получить к нему доступ после срабатывания mounted lifecycle
      this.$nextTick(function() {
        this.$refs.input.newValue = item.fullname;
      });
    },
    keyChanged(key) {
      // При смене ключа поиска (по имени/дропу/са) обнуляем свойство с результатами поиска (results)
      // и фильтрации предметов дропа (или са) с предыдущих запросов
      this.results = this.filteredOptions = [];
      // Далее сбрасываем значение поискового инпута
      this.$refs.input.newValue = "";

      // Отправляем событие родительскому компоненту с пустым свойством results
      // и null (в качестве переменной с поисковым запросом), заставляя его отрендерить первоначальное содержимое
      this.$emit("result", this.results, null);
      // Если в качестве ключа поиска выбраны SA - запустим метод getRbWithSA и сразу отобразим только тех рб, с которых качается SA.
      // А дальше уже сам пользователь сам сможет конкретизировать запрос.
      if (key === "sa") this.getRbWithSA();
    }
  }
};
</script>

<style>
.block.search {
  position: relative;
}
.search-key {
  position: absolute;
  right: 0;
  height: 100%;
  z-index: 2;
  padding: 0;
  line-height: 54px;
  margin: 0 !important;
}
.search-key .select-key {
  cursor: pointer;
  color: rgba(54, 54, 54, 0.3);
  font-size: 14px;
}
.select-key > .key-label {
  float: left;
}
.select-key > .icon,
.select-key > .icon i {
  height: 54px;
}

/* .search-close {
  position: absolute;
  right: -30px;
  z-index: 2;
  line-height: 54px;
  cursor: pointer;
} */
.search input {
  padding-right: 150px;
}
.search .dropdown-menu {
  min-width: 0 !important;
  right: 0;
  left: inherit;
  padding: 0;
}

.search .dropdown-content {
  padding: 0;
}

.search .dropdown-content > .dropdown-item {
  padding-right: 8px !important;
}

a.dropdown-item.is-active {
  background-color: #23d160;
}

.no-results {
  margin: 10px 0;
}
</style>