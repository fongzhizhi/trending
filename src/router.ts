import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// 1.定义路由组件
import TestPage from './components/TestPage.vue'
import One from './components/One.vue'
import Auto from './components/Auto.vue'
import HistoricalPercent from './components/HistoricalPercent.vue'
import Customize from './components/Customize.vue'
import NotFound from './components/404.vue'

// 2.定义路由
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: TestPage,
    },
    {
        path: '/one',
        name: 'one',
        component: One,
        meta: {
            keepAlive: true, 
        }
    },
    {
        path: '/historical_percent',
        name: 'historical_percent',
        component: HistoricalPercent,
    },
    {
        path: '/auto',
        name: 'auto',
        component: Auto,
    },
    {
        path: '/customize',
        name: 'customize',
        component: Customize,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: NotFound,
    }
];

// 3.创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 4.绑定到Vue实例
export default router;