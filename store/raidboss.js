import axios from '@nuxtjs/axios';

export const state = () => ({
  allRaidBosses: [],
});

export const mutations = {
  SET_RAIDBOSS_LIST(state, data) {
    state.allRaidBosses = data;
  },
  FIND_RAIDBOSS(state, boss) {
    console.log(boss);
    const removeBoss = state.allRaidBosses.filter(rb => {
      return rb.name !== newboss.name;
    });
    state.allRaidBosses = removeBoss.push(boss);
    console.log('После исправления');
    console.log(state.allRaidBosses);
  },
};

export const actions = {
  async fetch({ commit }) {
    const { data } = await this.$axios.get('/rb/getall');
    commit('SET_RAIDBOSS_LIST', data);
  },

  findBoss({ commit }, payload) {
    commit('FIND_RAIDBOSS', payload);
  },
};

export const getters = {
  getAllRaidBosses(state) {
    return state.allRaidBosses;
  },
};
