<template>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <div class="title is-4">
          <span class="rb-fullname" @click="$emit('copyFullname')">{{boss.fullname}}</span>
        </div>
        <div class="subtitle is-6">
          <span class="subtitle-child" v-if="boss.lvl">{{boss.lvl}} lvl</span>
          <span class="subtitle-child" v-else>Нет палилки</span>
          <span class="subtitle-child" v-if="boss.account" @click="$emit('copyAccount')">
            <b-tooltip
              label="Аккаунт с палилкой. Кликни, чтобы скопировать"
              position="is-right"
              type="is-dark"
              animated
              multilined
            >
              <span class="account">{{boss.account}}</span>
            </b-tooltip>
          </span>
        </div>
      </div>
    </div>

    <div class="content">
      <b-field label="Статы">
        <div>
          <p v-if="boss.lvl">Уровень: {{boss.lvl}}</p>
          <p v-if="boss.hp">HP: {{boss.hp}}</p>
          <p v-if="boss.p_atk">P. Atk: {{boss.p_atk}}</p>
          <p v-if="boss.p_def">P. Def: {{boss.p_def}}</p>
          <p v-if="boss.m_atk">M. Atk: {{boss.m_atk}}</p>
          <p v-if="boss.m_def">M. Def: {{boss.m_def}}</p>
        </div>
      </b-field>
      <b-field label="Время последнего спаленного фарма">
        <p>{{$todMessage(boss.tod)}}</p>
      </b-field>
      <b-field label="Окно респа рб">
        <p>
          {{$respawnWindowMessage(
          boss.respawn_start,
          boss.respawn_end
          )}}
          <span v-if="timeleftToRespawn">({{timeleftToRespawn}})</span>
        </p>
      </b-field>
      <b-field label="Дроп">
        <span class="soul-crystal" v-if="soulCrystal">
          <img :src="soulCrystal.image" :alt="soulCrystal.fullname">
          <span
            class="condition"
          >С рб качается {{soulCrystal.fullname}}. {{boss.soulCrystalEnchantConditions}}</span>
        </span>
      </b-field>
      <table class="drop">
        <tbody>
          <td class="items">
            <tr v-for="item in fulldrop" :key="item.id">
              <td class="item-image">
                <img :src="item.image" :alt="item.fullname">
              </td>
              <td class="item-name clearfix">{{item.fullname}}</td>
            </tr>
            <tr v-for="item in consumables" :key="item.id">
              <td class="item-image">
                <img :src="item.image" :alt="item.fullname">
              </td>
              <td class="item-name clearfix">{{item.fullname}}</td>
            </tr>
          </td>
          <td class="items">
            <tr v-for="item in pieces" :key="item.id">
              <td class="item-image">
                <img :src="item.image" :alt="item.fullname">
              </td>
              <td class="item-name clearfix">{{item.fullname}}</td>
            </tr>
          </td>
        </tbody>
      </table>
      <button class="button is-info" type="button" @click="$emit('update')">Изменить</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "viewRaidBoss",
  data() {
    return {
      soulCrystal: this.$getSoulCrystals(this.boss.drop)[0]
    };
  },
  props: {
    boss: {
      type: Object,
      required: true
    },
    timeleftToRespawn: {
      type: String
    }
  },
  computed: {
    ...mapGetters({ isSetTimeToMoscow: "datetime/isSetTimeToMoscow" }),
    fulldrop() {
      let full = [];
      const dropList = this.boss.drop;
      return (full = dropList.filter(i => {
        return (
          i.type === "weapon" || i.type === "armor" || i.type === "jewelry"
        );
      }));
    },
    consumables() {
      let consumables = [];
      const dropList = this.boss.drop;
      return (consumables = dropList.filter(i => {
        return i.type === "сonsumables";
      }));
    },
    pieces() {
      let consumables = [];
      const dropList = this.boss.drop;
      return dropList.filter(i => {
        return i.type === "pieces";
      });
    }
  }
};
</script>

<style>
.drop {
  width: 100%;
}
.content table td {
  border: none;
  padding: 0;
}
td.item-name {
  padding-left: 8px !important;
  line-height: 32px;
  cursor: initial !important;
}
td.item-image img,
.soul-crystal img {
  height: 32px;
  width: 32px;
}
.soul-crystal .condition {
  line-height: 32px;
  vertical-align: top;
}
@media screen and (max-width: 768px) {
  .soul-crystal .condition {
    line-height: 24px;
    vertical-align: top;
  }
  td.items {
    display: initial;
  }
  td.item-image img,
  .soul-crystal img {
    height: 24px;
    width: 24px;
  }
  td.item-name {
    padding-left: 4px;
    line-height: 24px;
  }
}
</style>