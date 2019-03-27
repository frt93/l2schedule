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
      // В свойстве timeleftToRespawn хранятся данные о времени, оставшемся до начала/конца окна респа (или прошедшего с его конца).
      // Ключем для значения является id рб
      timeleftToRespawn: {},
      // В свойстве interval хранится ID запущенного в методе calculateTimeleft таймер-планировщиков.
      // Это необходимо, чтобы была возмощность уничтожить планировщик вне области видимости метода, в котором он вызван
      interval: 1,
      isModalActive: false,
      modalAction: null,
      raidBossToManage: null,
      isRemove: false
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
      // Записываем массив с РБ в отдельную переменную.
      const allRB = this.raidBosses;
      // Теперь перебираем массив и вычисляем для каждого рб статус респа, записывая его значения в объект timeleftToRespawn
      // Функцию перебора записываем в отдельную переменную, которая потом будет вызываться в запущенном ниже таймер-планировщике
      const calc = allRB.filter(boss => {
        const value = this.$timeleftToRespawn(
          boss.respawn_start,
          boss.respawn_end,
          boss.id
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
    }
  },

  created() {
    // Запускаем метод определения состояния респа рб.
    this.calculateTimeleft();
  },
  watch: {
    raidBosses() {
      clearInterval(this.interval);
      this.calculateTimeleft();
    }
  },
  beforeMount() {},
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
</style>

