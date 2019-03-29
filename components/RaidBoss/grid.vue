<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent" v-for="boss in data" :key="boss.id">
      <article
        class="tile is-child box"
        @click="$emit('view', boss)"
        :class="timeleft(boss.respawn_start, boss.respawn_end)"
      >
        <header class="grid-header">
          <p class="title is-4">{{boss.shortname}}</p>
          <div class="subtitle">
            <span class="subtitle-child" v-if="boss.lvl">
              <b-tooltip
                :label="`Уровень ${boss.fullname}`"
                position="is-bottom"
                type="is-dark"
                animated
              >{{boss.lvl}} lvl</b-tooltip>
            </span>

            <span class="subtitle-child" v-if="!boss.account">Нет палилки</span>
            <span
              class="subtitle-child"
              v-else
              @click="$emit('copy', `Логин аккаунта ${boss.account} с палилкой скопирован`, boss.account); $event.stopPropagation()"
            >
              <b-tooltip
                label="Аккаунт с палилкой. Кликни, чтобы скопировать"
                position="is-bottom"
                type="is-dark"
                animated
                multilined
              >
                <span class="account">{{boss.account}}</span>
              </b-tooltip>
            </span>
            <span class="subtitle-child timeleft">{{timeleftToRespawn[boss.id]}}</span>
          </div>
        </header>
        <div class="content">
          <div class="soul-crystal" v-if="$getSoulCrystals(boss.drop).length">
            <span>Качается</span>
            <b-tooltip
              v-for="sa in $getSoulCrystals(boss.drop)"
              :key="sa.shortname"
              :label="`С этого рб качается ${sa.fullname}. ${boss.soulCrystalEnchantConditions}`"
              position="is-bottom"
              type="is-dark"
              multilined
              animated
            >
              <a class="drop-tags" @click="$emit('search', sa); $event.stopPropagation()">
                <span class="item-name">{{sa.shortname}}</span>
              </a>
            </b-tooltip>
          </div>
          <div class="drop">
            <b-tooltip
              v-for="item in $getFulldrop(boss.drop)"
              :key="item.id"
              :label="item.fullname"
              position="is-bottom"
              type="is-dark"
              animated
            >
              <a class="drop-tags" @click="$emit('search', item); $event.stopPropagation()">
                <span class="item-name">{{item.shortname}}</span>
              </a>
            </b-tooltip>
          </div>
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
  methods: {
    timeleft(start, end) {
      const now = this.$moment().unix();
      if (start === null || end === null) return "no-info";
      else if (start > now) return "in-resp";
      else if (now >= start && now < end) return "in-window";
      else if (now > end) return "resp-lost";
    }
  }
};
</script>

<style>
.grid-header {
  margin-bottom: 1rem;
  border-bottom: 1px solid #efefef;
  height: 4.5rem;
}
.in-window .title,
.in-window .timeleft:before {
  color: #23d160;
}
.in-resp .title,
.in-resp .timeleft:before {
  color: #ea9220;
}
.resp-lost .title,
.resp-lost .timeleft:before {
  color: #ff3860;
}
.grid-header .subtitle {
  font-size: 12px !important;
}

.rb-fullname,
article.tile {
  cursor: pointer;
}

.drop-tags {
  color: #4a4a4a;
}
.drop-tags > .item-name {
  border-bottom: 1px dashed;
  border-color: #dfdfdf;
}
.drop-tags > .item-name:hover {
  border-color: #c4c4c4;
}
.drop > span:not(:last-child) .drop-tags:after {
  content: "•";
  border-bottom: none;
  color: #ccc;
  margin: 3px;
}

.drop-tags:hover a {
  border-color: #b5b5b5;
}

.tile .content {
  margin-top: -0.75rem;
}

.subtitle-child:not(:first-child):before {
  margin-right: 3px;
  content: "•";
}
.in-window .timeleft:before {
  animation: in-window 1s infinite ease-in-out;
}

@keyframes in-window {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}
</style>
