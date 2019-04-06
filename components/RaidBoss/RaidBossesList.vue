<template>
  <section class="section">
    <div class="container">
      <div class="block navigate">
        <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <a
              role="button"
              class="navbar-burger burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
              <a class="navbar-item">Все рб</a>
              <a class="navbar-item">Эпики</a>

              <a class="navbar-item">80-87 lvl</a>

              <a class="navbar-item">70-79 lvl</a>
              <a class="navbar-item" :class="{'active-search': isSearch}">
                <span class="search">
                  <i class="mdi mdi-magnify" v-if="!isSearch" @click="initSearch"></i>
                  <i class="mdi mdi-window-close" v-if="isSearch" @click="close"></i>
                </span>
              </a>
            </div>

            <div class="navbar-end">
              <div class="navbar-item">
                <div class="buttons">
                  <div class="respawn-switch" v-if="!isSearch">
                    <i
                      class="mdi mdi-circle in-window"
                      @click="filterByRespawn('inWindow')"
                      :class="{active: respawnSwitcher === 'inWindow'}"
                    ></i>
                    <i
                      class="mdi mdi-circle in-resp"
                      @click="filterByRespawn('inResp')"
                      :class="{active: respawnSwitcher === 'inResp'}"
                    ></i>
                    <i
                      class="mdi mdi-circle lost-resp"
                      @click="filterByRespawn('lostResp')"
                      :class="{active: respawnSwitcher === 'lostResp'}"
                    ></i>
                  </div>

                  <span class="view-type-switch">
                    <i
                      class="mdi mdi-view-module"
                      :class="{active: displayAs === 'viewGrid'}"
                      @click="displayAs = 'viewGrid'"
                    ></i>
                    <i
                      class="mdi mdi-format-list-bulleted"
                      :class="{active: displayAs === 'viewTable'}"
                      @click="displayAs = 'viewTable'"
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <transition name="menu-popover">
          <search v-if="isSearch" @result="result" @close="close" ref="search"></search>
        </transition>
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
          v-bind:is="displayAs"
        ></component>
      </transition>
    </div>

    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" :canCancel="['x', 'outside']">
      <modal
        :data="raidBossToManage"
        :initialAction="modalAction"
        :timeleftToRespawn="timeleftToRespawn"
        @copy="copy"
      ></modal>
    </b-modal>
    <remove :boss="raidBossToManage" v-if="isRemove" @removed="isRemove=false"></remove>
    <notifications></notifications>
  </section>
</template>

<script>
import viewGrid from "./grid";
import viewTable from "./table";
import modal from "./modal";
import remove from "./remove";
import search from "../ui/search";
import notifications from "./notifications";
import { mapGetters } from "vuex";
export default {
  components: {
    viewGrid,
    viewTable,
    modal,
    remove,
    search,
    notifications
  },
  data() {
    return {
      displayAs: this.displayType,
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
      // Запускаем таймер-планировщик только на клиенте
      if (process.client) {
        this.interval = setInterval(
          function() {
            this.$store.dispatch("raidbosses/sortByResp", allRB);
            return calc;
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
    close() {
      this.isSearch = false;
      this.searchResults = null;
    },

    filterByRespawn(key) {
      // Фильтруем рб по их статусу респа. Можно отобразить рб, у которых окно респа в данный момент / откат респа / респ утерян
      // Первым делом закрываем форму поиска, если она открыта.
      this.close();
      if (key === this.respawnSwitcher) {
        // Если повторно кликнули на тот же фильтр - отменяем фильтрацию и отобразим первоначальное содержимое
        this.respawnSwitcher = this.searchResults = null;
        return;
      }
      this.respawnSwitcher = key;
      this.searchResults = this.$store.getters[`raidbosses/get${key}`];
    }
  },

  beforeMount() {
    // Запускаем метод определения состояния респа рб.
    this.calculateTimeleft();
  },
  watch: {
    raidBosses() {
      clearInterval(this.interval);
      this.calculateTimeleft();
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style>
.content {
  font-size: 14px;
}

.rb-fullname,
.account {
  cursor: pointer;
}

.account:before {
  content: "@";
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
/* .navbar-start > .navbar-item:not(:last-child) {
  margin-right: 10px;
} */
.navbar-item {
  padding: 0 10px;
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
}

.respawn-switch {
  margin-left: 4px;
  display: inline-block;
  transition: 0.2s;
  animation: fadeIn;
  animation-duration: 0.5s;
}
.respawn-switch i {
  margin: 3px;
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

i.mdi-circle.active:before {
  border-radius: 100%;
  line-height: 1;
  border: 2px solid;
}

.view-type-switch {
  margin-left: 4px;
}

.view-type-switch i {
  font-size: 24px;
  line-height: 16px;
  border: 1px solid #d2d2d2;
  cursor: pointer;
  padding: 4px;
  float: left;
}

.view-type-switch i:first-of-type {
  border-right: 0;
  border-radius: 4px 0 0 4px;
}
.view-type-switch i:last-of-type {
  border-left: 0;
  border-radius: 0 4px 4px 0;
}
.view-type-switch .active {
  background: #00a046;
  border-color: #00a046;
  color: #fff;
  cursor: default;
}
</style>

