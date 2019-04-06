import cookie from 'cookie';
import { setAuthToken, resetAuthToken } from '~/plugins/auth';
export const strict = false;
export const state = () => ({});

export const mutations = {};
export const actions = {
  async nuxtServerInit({ dispatch }, context) {
    return (
      await dispatch('raidbosses/fetch'),
      await dispatch('items/fetch'),
      await new Promise((resolve, reject) => {
        const cookies = cookie.parse(context.req.headers.cookie || '');
        if (cookies.hasOwnProperty('x-access-token')) {
          setAuthToken(cookies['x-access-token']);
          dispatch('auth/fetch')
            .then(result => {
              resolve(true);
            })
            .catch(error => {
              console.log('Provided token is invalid:', error);
              resetAuthToken();
              resolve(false);
            });
        } else {
          resetAuthToken();
          resolve(false);
        }
      })
    );
  },
};
