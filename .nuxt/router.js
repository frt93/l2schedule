import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _0f6467c3 = () => interopDefault(import('..\\pages\\accounts\\index.vue' /* webpackChunkName: "pages_accounts_index" */))
const _b5adc192 = () => interopDefault(import('..\\pages\\dashboard\\index.vue' /* webpackChunkName: "pages_dashboard_index" */))
const _9f9303de = () => interopDefault(import('..\\pages\\me\\index.vue' /* webpackChunkName: "pages_me_index" */))
const _72f80d6f = () => interopDefault(import('..\\pages\\auth\\confirm.vue' /* webpackChunkName: "pages_auth_confirm" */))
const _721b623d = () => interopDefault(import('..\\pages\\auth\\restore.vue' /* webpackChunkName: "pages_auth_restore" */))
const _7d5f4e43 = () => interopDefault(import('..\\pages\\auth\\signin.vue' /* webpackChunkName: "pages_auth_signin" */))
const _dc14b68e = () => interopDefault(import('..\\pages\\auth\\signup.vue' /* webpackChunkName: "pages_auth_signup" */))
const _56b6b725 = () => interopDefault(import('..\\pages\\dashboard\\items.vue' /* webpackChunkName: "pages_dashboard_items" */))
const _8375b1ca = () => interopDefault(import('..\\pages\\dashboard\\rb.vue' /* webpackChunkName: "pages_dashboard_rb" */))
const _741a4e5a = () => interopDefault(import('..\\pages\\me\\invite.vue' /* webpackChunkName: "pages_me_invite" */))
const _7f5164ae = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

Vue.use(Router)

if (process.client) {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'

    // reset scrollRestoration to auto when leaving page, allowing page reload
    // and back-navigation from other pages to use the browser to restore the
    // scrolling position.
    window.addEventListener('beforeunload', () => {
      window.history.scrollRestoration = 'auto'
    })

    // Setting scrollRestoration to manual again when returning to this page.
    window.addEventListener('load', () => {
      window.history.scrollRestoration = 'manual'
    })
  }
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected and scrollToTop is not explicitly disabled
  if (
    to.matched.length < 2 &&
    to.matched.every(r => r.components.default.options.scrollToTop !== false)
  ) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/accounts",
      component: _0f6467c3,
      name: "accounts"
    }, {
      path: "/dashboard",
      component: _b5adc192,
      name: "dashboard"
    }, {
      path: "/me",
      component: _9f9303de,
      name: "me"
    }, {
      path: "/auth/confirm",
      component: _72f80d6f,
      name: "auth-confirm"
    }, {
      path: "/auth/restore",
      component: _721b623d,
      name: "auth-restore"
    }, {
      path: "/auth/signin",
      component: _7d5f4e43,
      name: "auth-signin"
    }, {
      path: "/auth/signup",
      component: _dc14b68e,
      name: "auth-signup"
    }, {
      path: "/dashboard/items",
      component: _56b6b725,
      name: "dashboard-items"
    }, {
      path: "/dashboard/rb",
      component: _8375b1ca,
      name: "dashboard-rb"
    }, {
      path: "/me/invite",
      component: _741a4e5a,
      name: "me-invite"
    }, {
      path: "/",
      component: _7f5164ae,
      name: "index"
    }],

    fallback: false
  })
}
