import Vue from 'vue'
import VueRouter from 'vue-router'
import Top from '../views/Top.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Top',
        component: Top,
        meta: { title: 'じゃんけん Online：Top', desc: 'コロナ渦なのに まだ対面でじゃんけんしてるんですか？テレビ会議でじゃんけんできてますか？？多数決なんてもう古い！これからはじゃんけんの時代！！全てはじゃんけんできましょう！！！' }
    },
    {
        path: '/about',
        name: 'About',
        // ルートレベルのコード分割これにより、このルート用に個別のチャンク（about。[hash] .js）が生成され、ルートにアクセスしたときに遅延読み込みされます。
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
        meta: { title: 'じゃんけん Online：About', desc: 'コロナ渦なのに まだ対面でじゃんけんしてるんですか？テレビ会議でじゃんけんできてますか？？多数決なんてもう古い！これからはじゃんけんの時代！！全てはじゃんけんできましょう！！！' }

    },
    {
        path: '/whats',
        name: 'Whats',
        component: () => import('../views/Whats.vue'),
        meta: { title: 'じゃんけん Online：Whats', desc: 'コロナ渦なのに まだ対面でじゃんけんしてるんですか？テレビ会議でじゃんけんできてますか？？多数決なんてもう古い！これからはじゃんけんの時代！！全てはじゃんけんできましょう！！！' }

    },
    {
        path: '/getstart',
        name: 'GetStart',
        component: () => import('../views/GetStart.vue'),
        meta: { title: 'じゃんけん Online：GetStart', desc: 'コロナ渦なのに まだ対面でじゃんけんしてるんですか？テレビ会議でじゃんけんできてますか？？多数決なんてもう古い！これからはじゃんけんの時代！！全てはじゃんけんできましょう！！！' }

    },
    {
        path: '/terms',
        name: 'Terms',
        component: () => import('../views/Terms.vue'),
        meta: { title: 'じゃんけん Online：Terms', desc: 'コロナ渦なのに まだ対面でじゃんけんしてるんですか？テレビ会議でじゃんけんできてますか？？多数決なんてもう古い！これからはじゃんけんの時代！！全てはじゃんけんできましょう！！！' }

    },
    {
        path: '/rooms',
        name: 'Rooms',
        component: () => import('../views/Rooms.vue'),
        meta: { title: 'じゃんけん Online：Rooms', desc: 'コロナ渦なのに まだ対面でじゃんけんしてるんですか？テレビ会議でじゃんけんできてますか？？多数決なんてもう古い！これからはじゃんけんの時代！！全てはじゃんけんできましょう！！！' }

    },
    {
        path: '/battleRoom',
        name: 'BattleRoom',
        component: () => import('../views/BattleRoom'),
        meta: { title: 'じゃんけん Online：Room', desc: 'コロナ渦なのに まだ対面でじゃんけんしてるんですか？テレビ会議でじゃんけんできてますか？？多数決なんてもう古い！これからはじゃんけんの時代！！全てはじゃんけんできましょう！！！' }

    },
]

const router = new VueRouter({
    routes
})

export default router
