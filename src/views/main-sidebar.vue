<template>
    <div>
        <Header></Header>
        <p class="returnPage" @click="back"> <i class="el-icon-arrow-left"></i>返回</p>
        <div class="sidebar">
            <el-menu
                    default-active="$router.path"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                <router-link to="/">
                <el-menu-item index="1">
                    <i class="el-icon-menu"></i>
                    <span slot="title">工作台</span>
                </el-menu-item>
                </router-link>
                <router-link to="/projects">
                <el-menu-item index="projects">
                    <i class="el-icon-folder"></i>
                    <span slot="title">项目</span>
                </el-menu-item>
                </router-link>
                <router-link  :to="{path:'/projectrepositories',query:{projectId:this.$route.query.projectId}}"  v-if="!this.$route.query.depotId">
                <el-menu-item index="3"  >
                    <i class="el-icon-document-copy"></i>
                    <span slot="title">代码仓库</span>
                </el-menu-item>
                </router-link>
                    <el-submenu index="3" v-else>
                        <template slot="title">
                            <router-link  :to="{path:'/projectrepositories',query:{projectId:this.$route.query.projectId}}" >
                            <i class="el-icon-document-copy"></i>
                            <span>代码仓库</span>
                            </router-link>
                        </template>
                        <el-menu-item index="4-1">成员管理</el-menu-item>
                        <router-link :to="{path:'/repositorydetail',query:{depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}}">
                        <el-menu-item index="4-2">源码</el-menu-item>
                        </router-link>
                        <router-link :to="{path:'/branch',query:{depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}}">
                        <el-menu-item index="4-3">分支管理</el-menu-item>
                        </router-link>
                        <router-link  :to="{path:'/MergeList',query:{depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}}" >
                        <el-menu-item index="4-4">合并请求</el-menu-item>
                        </router-link>
                        <router-link  :to="{path:'/commiterecord',query:{depotId:this.$route.query.depotId}}">
                        <el-menu-item index="4-5">提交记录</el-menu-item>
                        </router-link>
                    </el-submenu>
                <router-link to="/snippets">
                <el-menu-item index="4">
                    <i class="el-icon-postcard"></i>
                    <span slot="title">代码片段</span>
                </el-menu-item>
                </router-link>
           <!--     <el-menu-item index="6">
                    <i class="el-icon-setting"></i>
                    <span slot="title">合并请求</span>
                </el-menu-item>-->
                <router-link  :to="{path:'/creatssh'}" >
                <el-menu-item index="5">
                    <i class="el-icon-setting"></i>
                    <span slot="title">公钥管理</span>
                </el-menu-item>
                </router-link>
                 <!--   <el-menu-item index="8">
                        <i class="el-icon-setting"></i>
                        <span slot="title">源码</span>
                    </el-menu-item>-->
            </el-menu>

        </div>

    </div>
</template>

<script>
    import Header from "./header";

    export default {
        name: 'MainSidebar',
        components: {
            Header,
        },
        props: {
            msg: String
        },
        data() {
            return {
                dialogProjectForm: false,//新建项目
                dialogRepository: false,//仓库
                dialogCode: false,//仓库
                formLabelWidth: '130px',
                messageLength:'',
                projectList:[]
            }
        },
        mounted() {
            /* console.log(" this.$store.state.userInfo)",JSON.parse(this.$store.state.userInfo).userId )*/
            console.log("window.location.href ", this.$route.params.path)
            this.routePath = this.$route.path;
            console.log(" this,routePath", this.routePath)
            /*this.token?this.getDataList():''*/

        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            back(){
                this.$router.go(-1);//返回上一层
            },
        }
    }
</script>
<style scoped>
    ul {
        list-style-type: none;
        padding: 0;
    }

    a {
        color: #fff;

    }

    .sidebar {
        position: fixed;
        left: 0;
        top: 60px;
        padding-top: 20px;
        bottom: 0;
        width: 297px;
        background: #545c64;
    }
    .sidebar span{
        color: #fff;
    }
    .returnPage{
        position: fixed;
        left: 240px;
        top: 70px;
        font-size: 14px;
        color: #b5b6b7;
        line-height: 20px;
        z-index: 100;
        cursor: pointer;
    }
    .returnPage i{
        color: #b5b6b7;
        margin-right: 5px;
    }

</style>
