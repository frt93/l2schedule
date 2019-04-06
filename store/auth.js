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
          reject(e);
        });
    });
  },

  signOut({ commit }) {
    resetAuthToken();
    cookies.remove('x-access-token');
    this.$router.go();
    commit('reset_user');
  },

  restore({ commit }, key) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/users/restore', key)
        .then(res => {
          resolve(res);
        })
        .catch(e => {
          reject(e);
        });
    });
  },

  reset({ commit }, user) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/user/reset`, user)
        .then(res => {
          commit('set_user', res.data.user);
          setAuthToken(res.data.token);
          cookies.set('x-access-token', res.data.token, { expires: 365 });
          resolve(res);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
};

export const getters = {
  getUser(state) {
    return state.user;
  },
};
