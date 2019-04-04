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

  remove(state, id) {
    const raidBossesToKeep = state.allRaidBosses.filter(rb => {
      return rb.id !== id;
    });
    state.allRaidBosses = raidBossesToKeep;
  },
};

export const actions = {
  async fetch({ dispatch }) {
    const { data } = await this.$axios.get('/rb/all');
    dispatch('sortByResp', data);
  },

  sortByResp({ commit }, data) {
    const sort = this.$sortByMaxResp(data);
    commit('SET_RAIDBOSS_LIST', sort);
  },

  create({ commit }, boss) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/rb/create', boss)
        .then(res => {
          commit('add', res.data.boss);
          resolve(res);
        })
        .catch(e => {
          reject(e);
        });
    });
  },

  update({ dispatch, state }, boss) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/rb/update', boss)
        .then(res => {
          const allRaidBosses = state.allRaidBosses;

          let newRaidBossesList = allRaidBosses.filter(rb => {
            return rb.id !== res.data.boss.id;
          });
          newRaidBossesList.push(boss);
          dispatch('sortByResp', newRaidBossesList);
          resolve(res);
        })
        .catch(e => {
          reject(e);
        });
    });
  },

  remove({ commit }, boss) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/rb/remove', boss)
        .then(res => {
          commit('remove', boss.id);
          resolve(res);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
};

export const getters = {
  getAll(state) {
    return state.allRaidBosses;
  },
  getinWindow(state) {
    return state.inWindow;
  },
  getinResp(state) {
    return state.inResp;
  },
  getlostResp(state) {
    return state.lostResp;
  },
};
