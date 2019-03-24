export const state = () => ({
  allItems: [],
  fulldrop: [],
  pieces: [],
  consumables: [],
  sa: [],
});

export const mutations = {
  SET_ITEMS_LIST(state, items) {
    state.allItems = items;
  },
  SET_FULL_DROP_LIST(state) {
    const items = state.allItems;
    const fulldrop = items.filter(i => {
      return i.type.toLowerCase() === 'armor' || i.type === 'weapon' || i.type === 'jewelry';
    });
    state.fulldrop = fulldrop;
  },
  SET_PIECES_LIST(state) {
    const items = state.allItems;
    const pieces = items.filter(i => {
      return i.type.toLowerCase() === 'pieces';
    });
    state.pieces = pieces;
  },
  SET_CONSUMABLES_LIST(state) {
    const items = state.allItems;
    const consumables = items.filter(i => {
      return i.type.toLowerCase() === 'сonsumables';
    });
    state.consumables = consumables;
  },
  SET_SA_LIST(state) {
    const items = state.allItems;
    const sa = items.filter(i => {
      return i.type.toLowerCase() === 'sa';
    });
    state.sa = sa;
  },
  update(state, payload) {
    state.allItems = payload;
  },

  add(state, item) {
    state.allItems.push(item);
  },

  remove(state, item) {
    const itemsToKeep = state.allItems.filter(i => {
      return i.id !== item.id;
    });
    state.allItems = itemsToKeep;
  },
};

export const actions = {
  async fetch({ commit }) {
    const { data } = await this.$axios.get('/items/all');
    commit('SET_ITEMS_LIST', data);
  },

  update({ commit, state }, item) {
    const allItems = state.allItems;

    let newItemsList = allItems.filter(i => {
      return i.id !== item.id;
    });
    newItemsList.push(item);
    commit('update', newItemsList);
  },

  sortItemsByType({ commit }) {
    commit('SET_FULL_DROP_LIST');
    commit('SET_PIECES_LIST');
    commit('SET_CONSUMABLES_LIST');
    commit('SET_SA_LIST');
  },
};

export const getters = {
  getAll(state) {
    return state.allItems;
  },
};
