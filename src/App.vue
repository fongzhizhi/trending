<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <!--Tabs-->
  <el-tabs type="card" v-model="activeName" @tab-click="tabClick">
    <el-tab-pane label="主页" name="/"></el-tab-pane>
    <el-tab-pane label="个股价格指数分析" name="/one"></el-tab-pane>
    <el-tab-pane label="多股自动筛选" name="/auto"></el-tab-pane>
    <el-tab-pane label="自定义排序" name="/customize"></el-tab-pane>
  </el-tabs>
  <!--界面-->
  <div class="view-box">
    <router-view></router-view>
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
      const path = tab.paneName || '/';
      console.log(path)
      this.$router.push({path});
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
  margin-top: 60px;
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
</style>
