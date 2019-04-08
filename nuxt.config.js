require('dotenv').config();

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
    '~/plugins/filters.js',
    '~/plugins/auth.js',
    '~/plugins/sockets.js',
    { src: '~/plugins/datepicker', ssr: false },
  ],

  env: {
    sockets: process.env.WS_URL || 'hhttps://l2schedule.herokuapp.com/',
  },
  /*
   **Axios module config
   */
  axios: {
    baseURL: process.env.BASE_URL || 'https://l2schedule.herokuapp.com/api/',
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
  hooks: {
    build: {
      done(builder) {
        if (!builder.nuxt.options.dev) {
          setTimeout(() => process.exit(0), 1000);
        }
      },
    },
  },
  serverMiddleware: [
    // Will register file from project api directory to handle /api/* requires
    { path: '/api', handler: '~/api/index.js' },

    // We can create custom instances too
    // { path: '/', handler: '~/server.js' },
  ],
};
