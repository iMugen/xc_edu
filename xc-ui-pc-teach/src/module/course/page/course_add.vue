<template>
  <div>
    <el-form :model="courseForm" :rules="courseRules" label-width="80px" ref="courseForm">
      <el-form-item label="课程名称" prop="name">
        <el-input auto-complete="off" v-model="courseForm.name"></el-input>
      </el-form-item>
      <el-form-item label="适用人群" prop="users">
        <el-input auto-complete="off" type="textarea" v-model="courseForm.users"></el-input>
      </el-form-item>
      <el-form-item label="课程分类" prop="categoryActive">
        <el-cascader
          :options="categoryList"
          :props="props"
          expand-trigger="hover"
          v-model="categoryActive">
        </el-cascader>
      </el-form-item>
      <el-form-item label="课程等级" prop="grade">
        <b v-for="grade in gradeList">
          <el-radio :label="grade.sdId" v-model="courseForm.grade">{{grade.sdName}}</el-radio>&nbsp;&nbsp;
        </b>
      </el-form-item>
      <el-form-item label="学习模式" prop="studymodel">
        <b v-for="studymodel_v in learningModeList">
          <el-radio :label="studymodel_v.sdId" v-model="courseForm.studymodel">{{studymodel_v.sdName}}</el-radio>&nbsp;&nbsp;
        </b>

      </el-form-item>

      <el-form-item label="课程介绍" prop="description">
        <el-input type="textarea" v-model="courseForm.description"></el-input>
      </el-form-item>

    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click.native="save" type="primary">提交</el-button>
    </div>
  </div>
</template>
<script>

    import * as courseApi from '../api/course';
    import * as systemApi from '../../../base/api/system';

    export default {
        data() {
            return {
                learningModeList: [],
                gradeList: [],
                props: {
                    value: 'id',
                    label: 'name',
                    children: 'children'
                },
                categoryList: [],
                categoryActive: [],
                courseForm: {
                    id: '',
                    name: '',
                    users: '',
                    grade: '',
                    studymodel: '',
                    mt: '',
                    st: '',
                    description: ''
                },
                courseRules: {
                    name: [
                        {required: true, message: '请输入课程名称', trigger: 'blur'}
                    ],
                    category: [
                        {required: true, message: '请选择课程分类', trigger: 'blur'}
                    ],
                    grade: [
                        {required: true, message: '请选择课程等级', trigger: 'blur'}
                    ],
                    studymodel: [
                        {required: true, message: '请选择学习模式', trigger: 'blur'}
                    ]

                }
            }
        },
        methods: {
            //新增课程提交
            save() {
                //处理课程分类
                // 选择课程分类存储到categoryActive
                this.courseForm.mt = this.categoryActive[0]//大分类
                this.courseForm.st = this.categoryActive[1]//小分类
                courseApi.addCourseBase(this.courseForm).then(res => {
                    if (res.success) {
                        this.$message.success("提交成功")
                        //跳转到我的课程
                        this.$router.push({path: '/course/list'})
                    } else {
                        this.$message.error(res.message)
                    }

                })
            }
        },
        created() {

        },
        mounted() {
            // 查询课程分类
            courseApi.category_findlist().then(res => {
                this.categoryList = res.children;
                console.log(this.categoryList)

            });

            //查询数据字典
            //查询课程等级
            systemApi.sys_Dictionary('200').then(res => {
                debugger
                this.gradeList = res.dvalue;
            });
            //查询学习模式
            systemApi.sys_Dictionary('201').then(res => {
                this.learningModeList = res.dvalue;
            })
        }
    }
</script>
<style scoped>


</style>

