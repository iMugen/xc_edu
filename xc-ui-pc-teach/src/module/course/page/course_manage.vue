<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      active-text-color="#000"
      background-color="#eee"
      class="el-menu-demo"
      mode="horizontal"
      text-color="#000">
      <router-link :to="{path:'/course/manage/summary/'+this.courseid}" class="mui-tab-item">
        <el-menu-item index="1">课程首页</el-menu-item>
      </router-link>
      <router-link :to="{path:'/course/manage/baseinfo/'+this.courseid}" class="mui-tab-item">
        <el-menu-item index="2">基本信息</el-menu-item>
      </router-link>
      <router-link :to="{path:'/course/manage/picture/'+this.courseid}" class="mui-tab-item">
        <el-menu-item index="3">课程图片</el-menu-item>
      </router-link>
      <router-link :to="{path:'/course/manage/marketinfo/'+this.courseid}" class="mui-tab-item">
        <el-menu-item index="4">课程营销</el-menu-item>
      </router-link>
      <router-link :to="{path:'/course/manage/plan/'+this.courseid}" class="mui-tab-item">
        <el-menu-item index="5">课程计划</el-menu-item>
      </router-link>
      <router-link :to="{path:'/course/manage/teacher/'+this.courseid}" class="mui-tab-item">
        <el-menu-item index="6">教师信息</el-menu-item>
      </router-link>
      <router-link :to="{path:'/course/manage/pub/'+this.courseid}" class="mui-tab-item">
        <el-menu-item index="7">发布课程</el-menu-item>
      </router-link>
    </el-menu>
    <router-view class="main"></router-view>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                activeIndex: '2',
                courseid: ''
            }
        },
        methods: {},
        mounted() {
            //课程id
            this.courseid = this.$route.params.courseid
            console.log("courseid=" + this.courseid)
            //跳转到课程基本信息
            this.$router.push({path: '/course/manage/baseinfo/' + this.courseid})
        }
    }
</script>
<style scoped>
</style>
