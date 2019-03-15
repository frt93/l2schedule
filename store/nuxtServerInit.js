import datetime from './datetime';

export default {
  actions: {
    nuxtServerInit(VuexContext, context, query) {
      const time = Promise.resolve(
        context.$axios.get('/users/getdata').then(res => {
          VuexContext.commit('isMoscow', res.data.isMoscow);
        })
      );
      return time;
    },
  },
};
