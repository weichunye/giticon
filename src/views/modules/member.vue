<template>
  <div>
    <MainSidebar></MainSidebar>
    <div v-if="this.$route.query.membertype=='project'">
      <HomeSidebar></HomeSidebar>
    </div>
    <div  v-if="this.$route.query.membertype=='depot'">
      <CodeSidebar></CodeSidebar>
    </div>


  <div class="depotmember">
    <h3>名称</h3>
    <!--项目-->
    <div class="box">
      <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="projectValue"  size="medium" placeholder="输入成员名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" @click="searchSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <!--<div  style="text-align: right"><el-button type="primary">邀请新成员</el-button></div>-->
      <h4>所有成员：</h4>

      <dl class="menmerList" v-for="item in projectData">
        <dt>{{item.username}}</dt>
        <dd v-if="item.authType==1"> <el-button plain type="primary"size="small">开发者</el-button></dd>
        <dd v-if="item.authType==2"> <el-button plain type="info" size="small">测试</el-button></dd>
        <dd v-if="item.authType==3"> <el-button plain size="small">游客</el-button></dd>
      </dl>
  <!--    <dl class="menmerList">
        <dt>fdfsfsdf</dt>
        <dd> <el-button  type="primary" plain size="small">管理员</el-button></dd>
      </dl>-->
    </div>
    <!--//项目-->
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import MainSidebar from '../main-sidebar.vue';
import HomeSidebar from '../home-sidebar.vue';
import CodeSidebar from '../code-sidebar.vue';
export default {
  name: 'member',
  components: {
      MainSidebar,
      HomeSidebar,
      CodeSidebar
  },
    data () {
        return {
            projectValue:'',
            projectData:[],
            page:1,
            limit:5
        }
    },
    mounted(){
        if(this.$route.query.membertype=='project'){
            this.getProjectMember()
        }else{
            this.getDepotMember()
        }

    },
    methods:{
        //项目成员
        getProjectMember(){
            var _this=this;
            console.log("_this.$store.state.projectId",_this.$store.state.projectId)
            _this.axios.defaults.headers.common['token'] = _this.$store.state.token
            var params = new URLSearchParams();
            params.append("page", _this.page);
            params.append("limit", _this.limit);
            params.append("projectId",localStorage.getItem('projectId'));
            console.log("this.$store.state.token",this.$store.state.token)
            this.axios.post(this.config.baseURL + '/app/getProjectUserList',params)
                .then(function (response) {
                    _this.projectData=response.data.pageList.records
                    console.log(" this.projectData", response)
                    if(response.data.code!=0){
                        _this.$message({
                            message: response.data.msg,
                            type: response.data.code ==  "warning"
                        });

                    }
                })
        },

        //仓库成员
        getDepotMember(){
            var _this=this;
            _this.axios.defaults.headers.common['token'] = _this.$store.state.token
            var params = new URLSearchParams();
            params.append("page", _this.page);
            params.append("limit", _this.limit);
            params.append("depotId", localStorage.getItem('depotId'));
            this.axios.post(this.config.baseURL + '/app/depot/getDepotUserList',params)
                .then(function (response) {
                    console.log("=response.data",response.data)
                    _this.projectData=response.data.pageList.records

                })
        },
      //搜索提交
        searchSubmit () {
            console.log('11')
        },
        //行点击事件
        goToPositores (row, event, column) {
            console.log(row)
            this.$router.push({
                name: 'projectrepositories',
                query: {
                    'id':row.id
                }
            })
        }
    }
}
</script>
<style scoped>
  *{
    font-family: 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Noto Sans CJK SC', Sathu, EucrosiaUPC, Arial, Helvetica, sans-serif;
    color: #000;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
  }

  .depotmember{
    position: relative;
    margin:15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;
  }
  .depotmember h3{
    font-size: 18px;
    line-height: 40px;
    color: #666;
  }
  .depotmember .box{
    margin-top: 20px;
    width: 100%;
  }
  .home .box .morelink{
    display: block;
    margin-top: 10px;
    padding-right: 20px;
    font-size: 12px;
    color: #4396ca;
    text-align: right;
    text-decoration: underline;
  }
  .depotmember h4{
    width: 100%;
    font-size: 14px;

  }
  .depotmember p{
    overflow: hidden;
    display: block;
    width: 100%;
  }
  .depotmember p span{
    font-size: 12px;
    color: #999;
  }
  .depotmember .el-table td{
    padding: 6px 0;
  }
  .depotmember .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }
  .depotmember .iconcode{
    float: left;
    margin-right: 10px;
    display: inline-block;
    width: 26px;
    height: 26px;
    background: url("../../assets/icon_code.png") no-repeat;
    background-size: cover;
  }
  .depotmember .menmerList{
    width: 100%;
    display: block;
    overflow: hidden;
    color: #333;
    font-size: 14px;
    line-height: 50px;
    border-bottom: 1px solid #dedede;
  }
  .depotmember .menmerList dt{
    float: left;

  }
  .depotmember .menmerList dd{
    float: right;
  }

</style>
