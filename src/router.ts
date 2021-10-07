import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// 1.定义路由组件
import HelloWorld from './components/HelloWorld.vue'
import NotFound from './components/404.vue'

// 2.定义路由
const routes: RouteRecordRaw[] = [
    {
        path: '/home',
        name: 'home',
        component: HelloWorld,
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