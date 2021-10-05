import VueRouter, { RouteConfig } from 'vue-router'
// 1.定义路由组件
import HelloWorld from './components/HelloWorld.vue'
import NotFound from './components/HelloWorld.vue'
// 2.定义路由
const routes: RouteConfig[] = [
    {
        path: '/',
        name: 'home',
        component: HelloWorld,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: NotFound,
    }
]

// 3.创建路由实例
const router = new VueRouter({
    mode: 'history',
    routes,
});

// 4.绑定到Vue实例
export default router;