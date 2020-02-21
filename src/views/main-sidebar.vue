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
                <el-menu-item index="/" @click="goDetails('index')">
                    <i class="el-icon-menu"></i>
                    <span slot="title">工作台</span>
                </el-menu-item>
                <el-menu-item index="/projects" @click="goDetails('projects')">
                    <i class="el-icon-folder"></i>
                    <span slot="title">项目</span>
                </el-menu-item>
                <el-menu-item index="/projectrepositories"  v-if="!this.$route.query.depotId"  @click="goDetails('projectrepositories')">
                    <i class="el-icon-document-copy"></i>
                    <span slot="title">代码仓库</span>
                </el-menu-item>
                    <el-submenu index="3"  @click="goDetails('projectrepositories')" v-else>
                        <template slot="title">
                            <router-link  :to="{path:'/projectrepositories',query:{projectId:this.$route.query.projectId}}" >
                            <i class="el-icon-document-copy"></i>
                            <span>代码仓库</span>
                            </router-link>
                        </template>
                        <el-menu-item index="4-2"  @click="goDetails('repositorydetail')">源码</el-menu-item>
                        <el-menu-item index="4-3"  @click="goDetails('branch')">分支管理</el-menu-item>
                       <!-- <el-menu-item index="4-4"  @click="goDetails('MergeList')" >合并请求</el-menu-item>-->
                        <el-menu-item index="4-1"   @click="goDetails('member')">成员管理</el-menu-item>
                        <el-menu-item index="4-5" @click="goDetails('commiterecord')">提交记录</el-menu-item>
                    </el-submenu>
                <el-menu-item index="/snippets"  @click="goDetails('snippets')">
                    <i class="el-icon-postcard"></i>
                    <span slot="title">代码片段</span>
                </el-menu-item>
           <!--     <el-menu-item index="6">
                    <i class="el-icon-setting"></i>
                    <span slot="title">合并请求</span>
                </el-menu-item>-->
                <el-menu-item index="/creatssh"  @click="goDetails('creatssh')">
                    <i class="el-icon-setting"></i>
                    <span slot="title">公钥管理</span>
                </el-menu-item>
                <el-menu-item index="/MergeList"  @click="goDetails('MergeList')">
                    <i class="el-icon-setting"></i>
                    <span slot="title">合并请求</span>
                </el-menu-item>
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
            let path = this.$route.path;
            this.navConfig = [
                {index:'1',path:['/system/aa','/system/bb','/system/cc']},
            ];
            let thisNav = this.navConfig.find(item =>{
                return item.path.includes(path);
            });
            this.defaultOpeneds = [thisNav.index];

        },
        methods: {

            goDetails(ele){
                var _this=this
                var name=""
                var params={}
                if(ele=="index"){
                    name="/"
                    params={}
                }
                if(ele=="projects"){
                    name="/projects"
                    params={}
                }
                if(ele=="projectrepositories"){
                    name="/projectrepositories"
                    params={projectId:this.$route.query.projectId}
                }
                if(ele=="repositorydetail"){
                    name="/repositorydetail"
                    params={depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}
                }
                if(ele=="branch"){
                    name="/branch"
                    params={depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}
                }
                if(ele=="MergeList"){
                    name="/MergeList"
                    params={depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}
                }
                if(ele=="commiterecord"){
                    name="/commiterecord"
                    params={depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}
                }
                if(ele=="member"){
                    name="/member"
                    params={depotId:this.$route.query.depotId,projectId:this.$route.query.projectId}
                }
                if(ele=="snippets"){
                    name="/snippets"
                    params={}
                }
                if(ele=="creatssh"){
                    name="/creatssh"
                    params={}
                }
                console.log("name",name)
                console.log("params",params)

                setTimeout(() => { //路由跳转
                    _this.$router.push({path:name,query:params});
                }, 100)


            },
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
