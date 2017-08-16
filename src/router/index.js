import Vue from 'vue'
import Router from 'vue-router'
// 注册router组件
Vue.use(Router)
// 导入组件
import home from '../components/home/home.vue'
import friends from '../components/friends/friends.vue'
import discover from '../components/discover/discover.vue'

let routes = [
  {path: '/home', name: 'home', component: home},
  {path: '/friends', name: 'friends', component: friends},
  {path: '/discover', name: 'discover', component: discover}
]

export default new Router({
  routes
})
