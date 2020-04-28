<template>
  <div>
    <el-button @click="teachplayFormVisible = true" type="primary">添加课程计划</el-button>
    <el-tree
      :data="teachplanList"
      :expand-on-click-node="false"
      :props="defaultProps"
      :render-content="renderContent"
      default-expand-all
      node-key="id">
    </el-tree>

    <el-dialog :visible.sync="teachplayFormVisible" title="添加课程计划">

      <el-form :model="teachplanActive" :rules="teachplanRules" label-width="140px" ref="teachplanForm"
               style="width:600px;">
        <el-form-item label="上级节点">
          <el-select placeholder="不填表示根结点" v-model="teachplanActive.parentid">
            <el-option
              :key="item.id"
              :label="item.pname"
              :value="item.id"
              v-for="item in teachplanList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="章节/课时名称" prop="pname">
          <el-input auto-complete="off" v-model="teachplanActive.pname"></el-input>
        </el-form-item>
        <el-form-item label="课程类型">
          <el-radio-group v-model="teachplanActive.ptype">
            <el-radio class="radio" label='1'>视频</el-radio>
            <el-radio class="radio" label='2'>文档</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学习时长（分钟）  请输入数字">
          <el-input auto-complete="off" type="number" v-model="teachplanActive.timelength"></el-input>
        </el-form-item>
        <el-form-item label="排序字段">
          <el-input auto-complete="off" v-model="teachplanActive.orderby"></el-input>
        </el-form-item>
        <el-form-item label="章节/课时介绍" prop="description">
          <el-input type="textarea" v-model="teachplanActive.description"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="teachplanActive.status">
            <el-radio class="radio" label="0">未发布</el-radio>
            <el-radio class="radio" label='1'>已发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="addTeachplan">提交</el-button>
          <el-button type="primary" v-on:click="resetForm">重置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="mediaFormVisible" title="选择媒资文件">
      <media-list @choosemedia="choosemedia" v-bind:ischoose="true"></media-list>
    </el-dialog>
  </div>
</template>
<script>
    let id = 1000;
    import * as courseApi from '../../api/course';
    import mediaList from '@/module/media/page/media_list.vue';

    export default {
        components: {
            mediaList
        },
        data() {
            return {
                mediaFormVisible: false,
                teachplayFormVisible: false,//控制添加窗口是否显示
                teachplanList: [{
                    id: 1,
                    pname: 'java',
                    children: [{
                        id: 2,
                        pname: '程序入门',
                        children: [{
                            id: 3,
                            pname: 'Hello World'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'pname'
                },
                teachplanRules: {
                    pname: [
                        {required: true, message: '请输入课程计划名称', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
                teachplanActive: {},
                teachplanId: '',
            }
        },
        methods: {
            //查询课程计划
            findTeachplan() {
                courseApi.findTeachplanList(this.courseid).then((res) => {
                    //应该是把上面的模型数据清空
                    this.teachplanList = [];
                    //不展示自己，因为在我的课程就显示了是哪门课程，点进来只显示子节点就可以了
                    if (res && res.children) {
                        this.teachplanList = res.children;
                    }
                })
            },

            //选择视频，打开窗口
            choosevideo(data) {
                //得到当前的课程计划
                this.teachplanId = data.id
//        alert(this.teachplanId)
                this.mediaFormVisible = true;//打开窗口
            },
            //保存选择的视频
            choosemedia(mediaId, fileOriginalName, mediaUrl) {
                //保存视频到课程计划表中
                let teachplanMedia = {}
                teachplanMedia.mediaId = mediaId;
                teachplanMedia.mediaFileOriginalName = fileOriginalName;
                teachplanMedia.mediaUrl = mediaUrl;
                teachplanMedia.courseId = this.courseid;
                //课程计划
                teachplanMedia.teachplanId = this.teachplanId

                courseApi.savemedia(teachplanMedia).then(res => {
                    if (res.success) {
                        this.$message.success("选择视频成功")
                        //查询课程计划
                        this.findTeachplan()
                    } else {
                        this.$message.error(res.message)
                    }
                })
            },
            //提交课程计划
            addTeachplan() {
                //校验表单
                debugger;
                this.$refs.teachplanForm.validate((valid) => {
                    if (valid) {
                        //调用api方法
                        //将课程id设置到teachplanActive
                        this.teachplanActive.courseid = this.courseid;
                        courseApi.addTeachplan(this.teachplanActive).then(res => {
                            if (res.success) {
                                this.$message.success("添加成功")
                                //刷新树
                                this.findTeachplan()
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                    }
                })
            },
            //重置表单
            resetForm() {
                this.teachplanActive = {}
            },

            append(data) {
                const newChild = {id: id++, label: 'testtest', children: []};
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);

            },
            edit(data) {
                //alert(data.id);
            },
            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);

            },
            renderContent(h, {node, data, store}) {
                return (
                    <span
                        style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button style="font-size: 12px;" type="text"
                         on-click={() => this.choosevideo(data)}>{data.mediaFileOriginalName}&nbsp;&nbsp;&nbsp;&nbsp; 选择视频</el-button>
              <el-button style="font-size: 12px;" type="text" on-click={() => this.edit(data)}>修改</el-button>
              <el-button style="font-size: 12px;" type="text" on-click={() => this.remove(node, data)}>删除</el-button>
            </span>
          </span>);
            }
        },
        mounted() {
            //初始化课程id
            this.courseid = this.$route.params.courseid;
            //查询课程计划
            this.findTeachplan();
        }
    }
</script>
<style>

</style>
