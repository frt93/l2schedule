export const state = () => ({
  isSetTimeToMoscow: false,
});

export const mutations = {
  isSetTimeToMoscow(state, payload) {
    state.isSetTimeToMoscow = payload;
  },
};

export const actions = {};

export const getters = {
  isSetTimeToMoscow(state) {
    return state.isSetTimeToMoscow;
  },
};
