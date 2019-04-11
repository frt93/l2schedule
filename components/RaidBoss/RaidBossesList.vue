<template>
  <div class="container">
    <transition name="menu-popover">
      <search v-if="isSearch" @result="result" @close="closeSearchForm" ref="search"></search>
    </transition>
    <div class="block navigate">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <!-- <div class="navbar-brand">
          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>-->

        <div class="navbar-menu sub-menu">
          <div class="navbar-start">
            <a class="navbar-item">Все рб</a>
            <a class="navbar-item">Эпики</a>

            <a class="navbar-item">80-87 lvl</a>

            <a class="navbar-item">70-79 lvl</a>
            <a class="navbar-item" :class="{'active-search': isSearch}">
              <span class="search">
                <i class="mdi mdi-magnify" v-if="!isSearch" @click="initSearch"></i>
                <i class="mdi mdi-window-close" v-if="isSearch" @click="closeSearchForm"></i>
              </span>
            </a>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <span class="respawn-switch" v-if="!isSearch">
                  <i
                    class="mdi mdi-circle in-window"
                    title="Показать рб, которые сейчас в респе"
                    @click="filterByRespawn('inWindow')"
                    :class="{active: respawnSwitcher === 'inWindow'}"
                  ></i>
                  <i
                    class="mdi mdi-circle in-resp"
                    title="Показать рб, у которых сейчас откат респа"
                    @click="filterByRespawn('inResp')"
                    :class="{active: respawnSwitcher === 'inResp'}"
                  ></i>
                  <i
                    class="mdi mdi-circle lost-resp"
                    title="Показать рб, респ которых утерян"
                    @click="filterByRespawn('lostResp')"
                    :class="{active: respawnSwitcher === 'lostResp'}"
                  ></i>
                </span>

                <span class="view-type-switch">
                  <i
                    class="mdi mdi-view-module"
                    :class="{active: displayType === 'grid'}"
                    @click="setDisplayType('grid')"
                  ></i>
                  <i
                    class="mdi mdi-format-list-bulleted"
                    :class="{active: displayType === 'tabular'}"
                    @click="setDisplayType('tabular')"
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <transition name="fade" mode="out-in">
      <component
        :data="searchResults ? searchResults : raidBosses"
        :timeleftToRespawn="timeleftToRespawn"
        @update="update"
        @copy="copy"
        @remove="remove"
        @view="view"
        @search="triggerSearch"
        v-bind:is="displayType"
      ></component>
    </transition>

    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" :canCancel="['x', 'outside']">
      <modal
        :data="raidBossToManage"
        :initialAction="modalAction"
        :timeleftToRespawn="timeleftToRespawn"
        @copy="copy"
      ></modal>
    </b-modal>
    <remove :boss="raidBossToManage" v-if="isRemove" @removed="isRemove=false"></remove>
  </div>
</template>

<script>
import grid from "./grid";
import tabular from "./table";
import modal from "./modal";
import remove from "./remove";
import search from "../ui/search";
import { mapGetters } from "vuex";
export default {
  components: {
    grid,
    tabular,
    modal,
    remove,
    search
  },
  data() {
    return {
      // В свойстве timeleftToRespawn хранятся данные о времени, оставшемся до начала/конца окна респа (или прошедшего с его конца).
      // Ключем для значения является id рб
      timeleftToRespawn: {},
      // В свойстве interval хранится ID запущенного в методе calculateTimeleft таймер-планировщиков.
      // Это необходимо, чтобы была возмощность уничтожить планировщик вне области видимости метода, в котором он вызван
      interval: 1,
      isModalActive: false,
      modalAction: null,
      raidBossToManage: null,
      isRemove: false,
      isSearch: false,
      searchResults: null,
      respawnSwitcher: null
    };
  },
  props: {
    displayType: {
      type: String
    }
  },
  computed: {
    ...mapGetters({
      raidBosses: "raidbosses/getAll"
    })
  },
  methods: {
    view(boss) {
      this.isModalActive = true;
      this.modalAction = "view";
      this.raidBossToManage = boss;
    },
    update(boss) {
      this.isModalActive = true;
      this.modalAction = "edit";
      this.raidBossToManage = boss;
    },
    remove(boss) {
      this.isRemove = true;
      this.raidBossToManage = boss;
    },
    calculateTimeleft() {
      // Записываем массив с РБ в отдельную переменную.
      const allRB = this.raidBosses;
      // Теперь перебираем массив и вычисляем для каждого рб статус респа, записывая его значения в объект timeleftToRespawn
      // Функцию перебора записываем в отдельную переменную, которая потом будет вызываться в запущенном ниже таймер-планировщике
      const calc = allRB.filter(boss => {
        const value = this.$timeleftToRespawn(
          boss.respawn_start,
          boss.respawn_end
        );
        // Т.к. мы изначально создали в $data пустой объект timeleftToRespawn,
        // то добавленные обычным методом в него свойства не будут реактивными.
        // Поэтому устанавливаем эти новые свойства с помощью сеттера
        this.$set(this.timeleftToRespawn, boss.id, value);
      });
    },

    timeleftIntervals() {
      // Запускаем таймер-планировщик только на клиенте
      if (process.browser) {
        const allRB = this.raidBosses;
        this.interval = setInterval(
          function() {
            this.$store.dispatch("raidbosses/sortByResp", allRB);
            // return calc;
          }.bind(this),
          10000
        );
      }
    },

    async copy(message, textToCopy) {
      try {
        await this.$copyText(textToCopy);
        this.$toast.open({
          message: message,
          type: "is-success",
          duration: 3000,
          queue: false
        });
      } catch (e) {
        this.$toast.open({
          message: e,
          type: "is-danger",
          duration: 3000,
          queue: false
        });
      }
    },

    /**
     * Переключение типа отображения содержимого между grid-сеткой и таблицей
     * @param type              Наименование типа
     * @return Array
     */
    setDisplayType(type) {
      this.$store.commit("user/setRaidbossesDisplayType", type);
    },

    initSearch() {
      this.isSearch = true;
      this.respawnSwitcher = this.searchResults = null;
    },

    triggerSearch(item) {
      // Метод вызывается по клику на элемент списка дропа в дочернем компоненте отображения списка РБ.
      // Аргументом в метод передается наименование выбранного предмета
      this.initSearch();
      let key;
      if (item.type === "sa") {
        key = "sa";
      } else {
        key = "item";
      }
      this.initSearch();
      this.$nextTick(function() {
        this.$refs.search.forceSearch(item, key);
      });
    },

    result(data, query) {
      this.searchResults = query ? data : this.raidBosses;
    },
    closeSearchForm() {
      this.isSearch = false;
      this.searchResults = null;
    },

    filterByRespawn(key) {
      // Фильтруем рб по их статусу респа. Можно отобразить рб, у которых окно респа в данный момент / откат респа / респ утерян
      // Первым делом закрываем форму поиска, если она открыта.
      this.closeSearchForm();
      if (key === this.respawnSwitcher) {
        // Если повторно кликнули на тот же фильтр - отменяем фильтрацию и отобразим первоначальное содержимое
        this.respawnSwitcher = this.searchResults = null;
        return;
      }
      this.respawnSwitcher = key;
      this.searchResults = this.$store.getters[`raidbosses/get${key}`];
    }
  },
  created() {
    // Запускаем метод определения состояния респа рб.
    this.calculateTimeleft();
  },
  beforeMount() {
    // Запускаем метод для автообновления отсчета респа
    this.timeleftIntervals();
  },
  watch: {
    raidBosses() {
      if (process.browser) {
        clearInterval(this.interval);
        this.calculateTimeleft();
        this.timeleftIntervals();
      }
    }
  },
  beforeDestroy() {
    if (process.browser) {
      clearInterval(this.interval);
    }
  }
};
</script>

<style>
.content {
  font-size: 14px;
}

@media screen and (min-width: 600px) and (max-width: 960px) {
  .tile.is-ancestor {
    grid-template-columns: repeat(2, 1fr);
    display: grid !important;
  }
  .tile:not(.is-child) {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
}
@media screen and (min-width: 960px) and (max-width: 1280px) {
  .tile.is-ancestor {
    grid-template-columns: repeat(3, 1fr);
    display: grid !important;
  }
}
@media screen and (min-width: 1280px) and (max-width: 1600px) {
  .tile.is-ancestor {
    grid-template-columns: repeat(4, 1fr);
    display: grid !important;
  }
}
@media screen and (min-width: 1601px) and (max-width: 1920px) {
  .tile.is-ancestor {
    grid-template-columns: repeat(5, 1fr);
    display: grid !important;
  }
}
@media screen and (min-width: 1920px) {
  .tile.is-ancestor {
    grid-template-columns: repeat(6, 1fr);
    display: grid !important;
  }
}
@media screen and (min-width: 2560px) {
  .tile.is-ancestor {
    grid-template-columns: repeat(8, 1fr);
    display: grid !important;
  }
}

.menu-popover-enter,
.menu-popover-leave-to {
  opacity: 0;
  transform: rotateY(10deg);
}
.menu-popover-enter-to,
.menu-popover-leave {
  opacity: 1;
  transform: rotateY(0deg);
}
.menu-popover-enter-active,
.menu-popover-leave-active {
  transition: opacity, transform 400ms ease-out;
}

.sub-menu .navbar-item {
  padding: 0;
}
.sub-menu .navbar-start > .navbar-item:not(:last-child) {
  margin-right: 10px;
}

.navbar-item:hover {
  background-color: transparent !important;
}
.navbar-item .search {
  font-size: 24px;
  line-height: 24px;
  padding: 0 4px;
}

.navbar-item.active-search {
  background-color: #ff3860 !important;
  color: #fff !important;
  padding: 0 10px;
}
.view-type-switch,
.respawn-switch {
  margin-left: 10px;
  transition: 0.2s;
  animation: fadeIn;
  animation-duration: 0.3s;
  display: inline-block;
  cursor: pointer;
}

.view-type-switch i,
.respawn-switch i {
  padding: 4px;
  float: left;
  border: 1px solid #d2d2d2;
  line-height: 20px;
}

.view-type-switch i {
  font-size: 24px;
}

i.in-resp {
  color: #ea9220;
}
i.in-window {
  color: #23d160;
}
i.lost-resp {
  color: #ff3860;
}

.view-type-switch i:first-of-type,
.respawn-switch i:first-of-type {
  border-right: 0;
  border-radius: 4px 0 0 4px;
}
.view-type-switch i:last-of-type,
.respawn-switch i:last-of-type {
  border-left: 0;
  border-radius: 0 4px 4px 0;
}
.view-type-switch .active,
.respawn-switch .active {
  background: #00a046;
  border-color: #00a046;
  color: #fff;
  cursor: default;
}

.respawn-switch .in-resp.active {
  background: #ea9220;
  border-color: #ea9220;
}
.respawn-switch .in-window.active {
  background: #23d160;
  border-color: #23d160;
}
.respawn-switch .lost-resp.active {
  background: #ff3860;
  border-color: #ff3860;
}
</style>

