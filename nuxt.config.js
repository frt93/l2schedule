module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'l2schedule',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Таблица с расписанием респа рб и прочее',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: '#3B8070', failedColor: 'red' },

  modules: ['@nuxtjs/axios', '@nuxtjs/dotenv', 'nuxt-buefy', 'nuxt-clipboard2', '@nuxtjs/moment'],
  plugins: [
    '~/plugins/datetime.js',
    { src: '~/plugins/datepicker', ssr: false },
    { src: '~/plugins/vuex-persistedstate.js', ssr: false },
  ],
  /*
   **Axios module config
   */
  axios: {
    baseURL: process.env.BASE_URL || 'https://l2scheduletoheroku.herokuapp.com/api/',
    retry: { retries: 5 },
    debug: false,
  },

  /*
   **Moment.js module config
   */
  moment: {
    locales: ['ru'],
  },

  /*
   ** Build configuration
   */

  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },
  serverMiddleware: ['~/api/index.js'],
};
