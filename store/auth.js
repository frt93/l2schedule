import cookies from 'js-cookie';
import { setAuthToken, resetAuthToken } from '~/plugins/auth';
export const state = () => ({
  user: null,
});

export const mutations = {
  set_user(state, user) {
    state.user = user;
  },
  reset_user(state) {
    state.user = null;
  },
};

export const actions = {
  fetch({ commit }) {
    return this.$axios
      .get('/me')
      .then(response => {
        commit('set_user', response.data);
        return response;
      })
      .catch(error => {
        commit('reset_user');
        return error;
      });
  },
  signIn({ dispatch, commit }, user) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/users/signin', user)
        .then(res => {
          commit('set_user', res.data.user);
          setAuthToken(res.data.token);
          cookies.set('x-access-token', res.data.token, { expires: 365 });
          resolve(res);
        })
        .catch(e => {
          dispatch('signOut');
          reject(e);
        });
    });
  },

  signUp({ dispatch, commit }, user) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/users/signup', user)
        .then(res => {
          commit('set_user', res.data.user);
          setAuthToken(res.data.token);
          cookies.set('x-access-token', res.data.token, { expires: 365 });
          resolve(res);
        })
        .catch(e => {
          dispatch('signOut');
          reject(e);
        });
    });
  },
  async signOut({ commit }) {
    await commit('reset_user');
    await resetAuthToken();
    cookies.remove('x-access-token');
    this.$router.go();
  },
};

export const getters = {
  getUser(state) {
    return state.user;
  },
};
