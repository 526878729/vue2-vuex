// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import FastClick from 'fastclick'
import router from './router'
import store from './vuex/store'
// import iconfont from 'material-design-icons/iconfont'
import MuseUi from './muse-ui.config'

// import 'mint-ui/lib/style.css'
// import MintUi from './mint-ui.config'

// museui carbon主题
import 'muse-ui/dist/theme-carbon.css'
// import 'muse-ui/dist/theme-light.css'
// import 'muse-ui/dist/theme-dark.css'
// import 'muse-ui/dist/theme-teal.css'
import './common/css/base.css'

Vue.use(MuseUi)

import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: './static/images/lazy2.png',
  loading: './static/images/loading.gif',
  attempt: 2,
  listenEvents: ['scroll']
})

FastClick.attach(document.body)

Vue.prototype.context = context

// router.replace('home')

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (from.name == 'search') {
    store.state.search = false
    store.state.searchResult = []
  }
  if (from.name == 'details') {
    store.state.details = false
  }
  if (from.name == "business") {
    store.state.compayBusinessData = []
  }
  if (to.name == 'search') {
    store.state.search = true
  }
  if (to.name == 'details') {
    store.state.details = true
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  // 组件创建前，请求用户数据
  beforeCreate() {
    this.$store.state.isAjax = true
    this.$store.dispatch('getUserId')
  }
})

