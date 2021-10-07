import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as echarts from 'echarts';

// 实例
const app = createApp(App);
// 挂载插件
app.use(router); // 路由
app.use(ElementPlus); // ui
// 挂载全局属性
app.config.globalProperties.echarts = echarts; // echarts

// 挂载实例
app.mount('#app');