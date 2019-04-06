export const state = () => ({
  allRaidBosses: [],
  inWindow: [],
  inResp: [],
  lostResp: [],
  logs: [],
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

  addLog(state, message) {
    state.logs.unshift(message);
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
          // Коммит вызовется сокетом в компоненте (raidbosses/notifications)
          // commit('add', res.data.boss);
          resolve(res);
        })
        .catch(e => {
          reject(e);
        });
    });
  },

  update({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/rb/update', payload)
        .then(res => {
          dispatch('rebuild', res.data.boss);
          resolve(res);
        })
        .catch(e => {
          reject(e);
        });
    });
  },

  rebuild({ dispatch, state }, boss) {
    // Перебираем массив со всеми рб и обновляем в нем экземпляр обновленного рб
    const allRaidBosses = state.allRaidBosses;

    let newRaidBossesList = allRaidBosses.filter(rb => {
      return rb.id !== boss.id;
    });
    newRaidBossesList.push(boss);
    dispatch('sortByResp', newRaidBossesList);
  },

  remove({ commit }, boss) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/rb/remove', boss)
        .then(res => {
          // Коммит вызовется сокетом в компоненте (raidbosses/notifications)
          // commit('remove', boss);
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
  getLogs(state) {
    return state.logs;
  },
};
