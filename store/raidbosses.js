export const state = () => ({
  allRaidBosses: [],
  inWindow: [],
  inResp: [],
  lostResp: [],
});

export const mutations = {
  SET_RAIDBOSS_LIST(state, data) {
    state.allRaidBosses = data.all;
    state.inWindow = data.inWindow;
    state.inResp = data.inResp;
    state.lostResp = data.lostResp;
  },
  update(state, payload) {
    state.allRaidBosses = payload;
  },

  add(state, boss) {
    state.allRaidBosses.push(boss);
  },

  remove(state, boss) {
    const raidBossesToKeep = state.allRaidBosses.filter(rb => {
      return rb.id !== boss.id;
    });
    state.allRaidBosses = raidBossesToKeep;
  },
};

export const actions = {
  async fetch({ commit }) {
    const { data } = await this.$axios.get('/rb/all');
    const sort = this.$sortByMaxResp(data);
    commit('SET_RAIDBOSS_LIST', sort);
  },

  update({ commit, state }, boss) {
    const allRaidBosses = state.allRaidBosses;

    let newRaidBossesList = allRaidBosses.filter(rb => {
      return rb.id !== boss.id;
    });
    newRaidBossesList.push(boss);
    commit('update', newRaidBossesList);
  },
};

export const getters = {
  getAll(state) {
    return state.allRaidBosses;
  },
};