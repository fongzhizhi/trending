import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// 1.定义路由组件
import TestPage from './components/TestPage.vue'
import PriceIndex from './components/PriceIndex.vue'
import PriceIndexSearch from './components/PriceIndexSearch.vue'
import HistoricalPercent from './components/HistoricalPercent.vue'
import NotFound from './components/404.vue'

export enum RouterName {
    Home = 'home',
    PriceIndex = 'price_index',
    PriceIndexSearch = 'price_index_search',
    HistoricalPercent = 'historical_percent',
    NotFound = 'notfound',
}

// 2.定义路由
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: RouterName.Home,
        component: TestPage,
    },
    {
        path: '/price_index',
        name: RouterName.PriceIndex,
        component: PriceIndex,
        meta: {
            keepAlive: true, 
        }
    },
    {
        path: '/price_index_search',
        name: RouterName.PriceIndexSearch,
        component: PriceIndexSearch,
    },
    {
        path: '/historical_percent',
        name: RouterName.HistoricalPercent,
        component: HistoricalPercent,
        meta: {
            keepAlive: true, 
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: RouterName.NotFound,
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