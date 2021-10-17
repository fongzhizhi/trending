<template>
  <img id="logo" alt="logo" src="./assets/logo.svg" />
  <!--Tabs-->
  <el-tabs type="card" v-model="activeName" @tab-click="tabClick">
    <el-tab-pane label="主页" name="/"></el-tab-pane>
    <el-tab-pane label="个股价格指数分析" name="/one"></el-tab-pane>
    <el-tab-pane label="股价历史百分位" name="/historical_percent"></el-tab-pane>
    <el-tab-pane label="多股自动筛选" name="/auto"></el-tab-pane>
    <el-tab-pane label="自定义排序" name="/customize"></el-tab-pane>
  </el-tabs>
  <!--组件-->
  <div class="view-box">
    <router-view v-slot="{ Component }">
      <keep-alive>
          <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
  
</template>

<script lang="ts">
export default {
  data() {
    return {
      activeName: 'home',
    }
  },
  methods: {
    tabClick(tab: any) {
      const THIS: any = this;
      const path = tab.paneName || '/';
      THIS.$router.push({path});
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#logo {
  width: 120px;
  margin: 20px auto;
}
.tabs {
  display: inline-flex;
  align-items: center;
}
.tabs > a {
  text-decoration:none;
  margin: 0px 10px;
  border: solid 1px #cfdeec;
  background: #e8e4e4;
}
.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  background: aliceblue;
}
</style>
