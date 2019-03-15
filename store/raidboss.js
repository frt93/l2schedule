import axios from '@nuxtjs/axios';

export const state = () => ({
  allRaidBosses: [],
});

export const mutations = {
  SET_RAIDBOSS_LIST(state, data) {
    state.allRaidBosses = data;
  },
  editRaidBoss(state, payload) {
    state.allRaidBosses = payload;
  },
};

export const actions = {
  async fetch({ commit }) {
    const { data } = await this.$axios.get('/rb/getall');
    commit('SET_RAIDBOSS_LIST', data);
  },

  editRaidBoss({ commit, state }, boss) {
    const allRaidBosses = state.allRaidBosses;

    let newRaidBossesList = allRaidBosses.filter(rb => {
      return rb.fullname !== boss.fullname;
    });
    newRaidBossesList.push(boss);
    commit('editRaidBoss', newRaidBossesList);
  },
};

export const getters = {
  getAllRaidBosses(state) {
    return state.allRaidBosses;
  },
};
