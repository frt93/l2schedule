<template>
  <div class="tile is-parent">
    <article class="tile is-child box" @click="isComponentModalActive = true">
      <p class="title">{{boss.shortname}}</p>
      <div class="subtitle account" v-if="boss.account">
        <b-tooltip
          label="Аккаунт с палилкой. Нажми, чтобы скопировать"
          position="is-bottom"
          type="is-dark"
          animated
          multilined
        >
          <a
            @click="copy(`Логин аккаунта ${boss.account} с палилкой скопирован`); $event.stopPropagation()"
          >@{{boss.account}}</a>
        </b-tooltip>
      </div>
      <b-tooltip
        v-for="item in boss.items"
        :key="item.name"
        :label="item.name"
        position="is-bottom"
        type="is-dark"
        animated
      >
        <a class="drop-tags">#{{item.shortname}}&#032;&#032;</a>
      </b-tooltip>
      <b-tooltip
        v-for="sa in boss.sa"
        :key="sa.name"
        :label="`С этого рб качается ${sa.name}. ${boss.enchantConditions}`"
        position="is-bottom"
        type="is-dark"
        multilined
        animated
      >
        <a v-if="boss.isSA" class="drop-tags">#{{sa.shortname}}&#032;&#032;</a>
      </b-tooltip>
    </article>
    <b-modal :active.sync="isComponentModalActive" has-modal-card>
      <modal :boss="boss" @copy="copy"></modal>
    </b-modal>
  </div>
</template>

<script>
import modal from "./BossModal";

export default {
  components: {
    modal
  },
  data() {
    return {
      isComponentModalActive: false
    };
  },
  props: {
    boss: Object,
    required: true
  },
  methods: {
    async copy(text) {
      try {
        await this.$copyText(text);
        this.success(text);
      } catch (e) {
        console.error(e);
      }
    },
    success(text) {
      this.$toast.open({
        message: text,
        type: "is-success",
        duration: 3000
      });
    }
  }

  // created() {
  //   this.$store.dispatch(
  //     "calculateGmtAndLocalDifference",
  //     this.$moment(new Date())
  //   );
  //   console.log(this.$store.getters.getTime);
  // }
};
</script>

<style>
.drop-tags {
  margin-right: 5px;
}
</style>
