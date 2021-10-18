import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// 1.定义路由组件
import TestPage from './components/TestPage.vue'
import PriceIndex from './components/PriceIndex.vue'
import PriceIndexSearch from './components/PriceIndexSearch.vue'
import HistoricalPercent from './components/HistoricalPercent.vue'
import NotFound from './components/404.vue'

// 2.定义路由
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: TestPage,
    },
    {
        path: '/price_index',
        name: 'price_index',
        component: PriceIndex,
        meta: {
            keepAlive: true, 
        }
    },
    {
        path: '/price_index_search',
        name: 'price_index_search',
        component: PriceIndexSearch,
    },
    {
        path: '/historical_percent',
        name: 'historical_percent',
        component: HistoricalPercent,
        meta: {
            keepAlive: true, 
        }
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