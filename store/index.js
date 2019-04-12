import cookie from 'cookie';
import { setAuthToken, resetAuthToken } from '~/plugins/auth';
export const strict = false;
export const state = () => ({});

export const mutations = {};
export const actions = {
  async nuxtServerInit({ dispatch, commit, axios }, context) {
    return (
      await dispatch('raidbosses/fetch'),
      await dispatch('items/fetch'),
      await new Promise((resolve, reject) => {
        const cookies = cookie.parse(context.req.headers.cookie || '');
        // console.log(cookies);
        // console.log(context.$axios);
        if (cookies.hasOwnProperty('x-access-token')) {
          // setAuthToken(cookies['x-access-token']);
          context.$axios.defaults.headers.common['x-access-token'] = cookies['x-access-token'];

          if (cookies.hasOwnProperty('rb-display-type')) {
            commit('user/setRaidbossesDisplayType', cookies['rb-display-type']);
          }
          if (cookies.hasOwnProperty('is-moscow-time')) {
            commit('user/isSetTimeToMoscow', cookies['is-moscow-time']);
          }
          dispatch('user/fetch')
            .then(result => {
              resolve(true);
            })
            .catch(error => {
              console.log('Provided token is invalid:', error);
              // resetAuthToken();
              delete context.$axios.defaults.headers.common['x-access-token'];
              resolve(false);
            });
        } else {
          // resetAuthToken();
          delete context.$axios.defaults.headers.common['x-access-token'];
          resolve(false);
        }
      })
    );
  },
};
