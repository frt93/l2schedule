<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent" v-for="boss in data" :key="boss.id">
      <article class="tile is-child box" @click="$emit('view', boss)">
        <p class="title is-4">{{boss.shortname}}</p>
        <div class="subtitle">
          <no-ssr>
            <b-tooltip
              :label="`Уровень ${boss.fullname}`"
              position="is-bottom"
              type="is-dark"
              animated
            >
              <span class="mdi-my mdi mdi-arrow-up-bold">{{boss.lvl}}</span>
            </b-tooltip>

            <span class="mdi-my mdi mdi-account" v-if="!boss.account">Нет палилки</span>

            <b-tooltip
              label="Аккаунт с палилкой. Кликни, чтобы скопировать"
              position="is-bottom"
              type="is-dark"
              animated
              multilined
            >
              <span
                class="mdi-my mdi mdi-account"
                v-if="boss.account"
                @click="$emit('copy', `Логин аккаунта ${boss.account} с палилкой скопирован`, boss.account); $event.stopPropagation()"
              >{{boss.account}}</span>
            </b-tooltip>
          </no-ssr>
        </div>
        <div class="content">
          <span class="mdi-my mdi mdi-progress-clock">{{timeleftToRespawn[boss.id]}}</span>
          <no-ssr>
            <div>
              <span class="mdi-my mdi mdi-package-variant"></span>
              <b-tooltip
                v-for="item in $getFulldrop(boss.drop)"
                :key="item.id"
                :label="item.fullname"
                position="is-bottom"
                type="is-dark"
                animated
              >
                <span class="drop-tags">
                  #
                  <a>{{item.shortname}}&#032;&#032;</a>
                </span>
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
            </div>
          </no-ssr>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  name: "grid",
  data() {
    return {};
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    timeleftToRespawn: {
      type: Object,
      required: true
    }
  },
  methods: {}
};
</script>

<style>
.drop-tags a {
  margin-right: 5px;
  border-bottom: 1px dashed #dfdfdf;
}

.drop-tags:hover a {
  border-color: #b5b5b5;
}

.tile .content {
  margin-top: -0.75rem;
}
</style>
