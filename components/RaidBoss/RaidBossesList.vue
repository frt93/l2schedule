<template>
  <section class="section">
    <div class="container">
      <component
        :data="raidBosses"
        :timeleftToRespawn="timeleftToRespawn"
        @update="update"
        @copy="copy"
        @remove="remove"
        @view="view"
        v-bind:is="displayType"
      ></component>
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
  </section>
</template>

<script>
import rbGrid from "./grid";
import rbTable from "./table";
import modal from "./modal";
import remove from "./remove";
import { mapGetters } from "vuex";
export default {
  components: {
    rbGrid,
    rbTable,
    modal,
    remove
  },
  data() {
    return {
      // В переменной timeleftToRespawn хранятся данные о времени, оставшемся до конца окна респа (или прошедшего с его конца).
      // Ключем для значения является id рб
      timeleftToRespawn: {},
      // В переменной intervals хранятся ID всех запущенных таймер-планировщиков.
      // Ключом для значения в объекте так же является ID рб
      intervals: {},
      isModalActive: false,
      modalAction: null,
      raidBossToManage: null,
      isRemove: false,
      mmodal: modal
    };
  },
  props: {
    displayType: {
      type: String
    }
  },
  computed: {
    ...mapGetters({ raidBosses: "raidbosses/getAll" })
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
      const allRB = this.raidBosses; // Записываем массив с РБ в отдельную переменную.
      // Теперь перебираем массив и запускаем для каждого рб в нем таймер-планировщик
      // для вычисления времени оставшегося до начала либо конца респауна
      allRB.filter(boss => {
        const value = this.$timeleftToRespawn(
          boss.respawn_start,
          boss.respawn_end,
          boss.id
        );
        // Т.к. мы изначально создали в $data пустой объект timeleftToRespawn,
        // то добавленные обычным методом в него свойства не будут реактивными.
        // Поэтому устанавливаем эти новые свойства с помощью сеттера
        this.$set(this.timeleftToRespawn, boss.id, value);
        const timer = setInterval(
          function() {
            return (this.timeleftToRespawn[boss.id] = this.$timeleftToRespawn(
              boss.respawn_start,
              boss.respawn_end,
              boss.id
            ));
          }.bind(this),
          10000
        );
        this.$set(this.intervals, boss.id, timer);
      });
    },
    clearIntervals() {
      const intervals = this.intervals;
      for (var id in intervals) {
        // Перебираем объект с запущенными тайм-планировщиками и уничтожаем их,
        // передавая в метод-убийцу ID босса, который является ключем для значения самого планировщика
        clearInterval(intervals[id]);
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
    }
  },

  created() {
    this.calculateTimeleft();
  },
  watch: {
    raidBosses() {
      this.clearIntervals();
      this.calculateTimeleft();
    }
  },
  beforeMount() {},
  beforeDestroy() {
    this.clearIntervals();
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
</style>

