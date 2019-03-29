export const strict = false;
export const state = () => ({
  counter: 0,
});

export const mutations = {};
export const actions = {
  nuxtServerInit({ dispatch }) {
    return dispatch('raidbosses/fetch'), dispatch('items/fetch');
  },
};
