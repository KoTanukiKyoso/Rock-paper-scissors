import Vue from 'vue'
import VueRouter from 'vue-router'
import Top from '../views/Top.vue'

Vue.use(VueRouter)

//
const routes = [
  {
    path: '/',
    name: 'Top',
    component: Top
  },
  {
    path: '/about',
    name: 'About',
    // ルートレベルのコード分割これにより、このルート用に個別のチャンク（about。[hash] .js）が生成され、ルートにアクセスしたときに遅延読み込みされます。
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
