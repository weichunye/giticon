<template>
  <div>
    <MainSidebar></MainSidebar>
    <HomeSidebar></HomeSidebar>
  <div class="home">
    <h3>工作台</h3>
    <!--代码仓库-->
    <div class="box">
      <el-table class="entrepottable"
              :data="getDataList.depotList"
              style="width: 100%">
        <el-table-column
                prop="entrepot"
                label="代码仓库"
                width="180">
          <template slot-scope="scope">
              <span class="iconcode"   @click="goToDopot(scope.row)">{{scope.row.name.slice(0,1)}}</span>
              <h4>{{scope.row.name}}</h4>

           <p> <span>{{scope.row.username}}</span>

             </p>
          </template>
        </el-table-column>
        <el-table-column
                prop="description"
                label="描述"
               >
        </el-table-column>
        <el-table-column
                prop="createTime"
                label="创建时间"  width="180">
          <template slot-scope="scope">
            {{scope.row.createTime.substring(0,10)}}
          </template>
        </el-table-column>
        <el-table-column
                prop="lastUpdateTime"
                label="上次更新">
        </el-table-column>
        <el-table-column  width="60"  prop="">
          <template slot-scope="scope">
          <span class="iconlock"></span>
          </template>
        </el-table-column>
      </el-table>
      <div class="morelink">     <router-link to="/projectrepositories">更多</router-link></div>

    </div>
    <!--//代码仓库-->
    <!--代码片段-->
    <div class="box">
      <el-table class="entrepottable"
                :data="getDataList.snippetList"
                style="width: 100%">
        <el-table-column
                prop="name"
                label="名称"
                width="180">
          <template slot-scope="scope">
            <span class="iconcode"  @click="goToSnipper(scope.row)">{{scope.row.name.slice(0,1)}}</span>
            <h4>{{scope.row.name}}</h4>

          </template>
        </el-table-column>
        <el-table-column
                prop="ownerId"
                label="创建人">
        </el-table-column>
        <el-table-column
                prop="createTime"
                label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime.substring(0,10)}}
          </template>
        </el-table-column>
        <el-table-column
                prop="lastUpdateTime"
                label="上次更新">
          <template slot-scope="scope">
            {{scope.row.updateTime.substring(0,10)}}
          </template>
        </el-table-column>

      </el-table>
      <div class="morelink"><router-link to="/snippets">更多</router-link></div>
    </div>
    <!--//代码片段-->
    <!--项目-->
    <div class="box">
      <el-table class="projectData"
                :data="getDataList.projectList"
                style="width: 100%">
        <el-table-column
                prop="name"
                label="项目名称"
                width="180">
          <template slot-scope="scope">
            <span class="iconcode"  @click="goToPositores(scope.row)">{{scope.row.name.slice(0,1)}}</span>
            <p>{{scope.row.name}}</p>
          </template>

        </el-table-column>
        <el-table-column
                prop="description"
                label="项目描述">
        </el-table-column>
        <el-table-column
                prop="depotNum"
                label="代码仓库">
        </el-table-column>
        <el-table-column
                prop="snippetNum"
                label="代码片段">
        </el-table-column>
        <el-table-column
                prop="userNum"
                label="项目成员">
        </el-table-column>
        <el-table-column
                prop="createTime"
                label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime.substring(0,10)}}
          </template>
        </el-table-column>
        <el-table-column
                prop="lastUpdateTime"
                label="上次更新">
          <template slot-scope="scope">
            {{scope.row.lastUpdateTime.substring(0,10)}}
          </template>
        </el-table-column>
      </el-table>
      <div class="morelink"><router-link to="/projects">更多</router-link></div>
    </div>
    <!--//项目-->

  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import MainSidebar from './main-sidebar.vue';
import HomeSidebar from './home-sidebar.vue';

export default {
  name: 'home',
  components: {
      MainSidebar,
      HomeSidebar
  },
    data () {
        return {
            getDataList:[],
            entrepotData:[],
            fragmentData:[],
            projectData:[],
        }
    },
    mounted(){
        var _this=this;
        _this.axios.defaults.headers.common['token'] = _this.$store.state.token
        console.log("this.$store.state.token",_this.$store.state.token)
        this.axios.post(this.config.baseURL + '/app/index/myWorkbench ')
            .then(function (response) {
                console.log(" this.projectData",response)
                _this.getDataList=response.data.workbench
                if(response.data.code!=0){
                    _this.$message({
                        message: response.data.msg,
                        type: response.data.code ==  "warning"
                    });

                }
            })
    },
    methods:{
        goToPositores (row, event, column) {
            console.log(row, event, column)
            this.$router.push({
                name: 'projectrepositories',
                query: {
                    'id':row.id,

                }
            })
            localStorage.setItem('projectId', row.id )
            localStorage.setItem('projectName',row.name )
        },
        goToDopot(row){
            console.log(row)
            localStorage.setItem('projectId', row.projectId )
            localStorage.setItem('depotId', row.id )
            this.$router.push({
                name: 'repositorydetail',
                query: {
                    'projectId': this.$route.query.id,
                    'depotId': row.id
                }
            })
        },
        goToSnipper(row){
            var _this=this;
            console.log(row)
            localStorage.setItem('snippetsId', row.id )
            this.$router.push({
                name: 'snipperdetails',
                query: {
                    'id':row.id,
                }
            })
        },

        goToDetail (row, event, column) {
            console.log(row, event, column)
            this.$router.push({
                name: 'repositorydetail',
                query: {
                    'id':'1'
                }
            })
        },

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
  a {
    color: #42b983;
  }
  .home{
    position: relative;
    margin:15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;
  }
  .home h3{
    font-size: 18px;
    line-height: 40px;
    color: #666;
  }
  .home .box{
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
  .entrepottable h4{
    width: 100%;
    font-size: 14px;

  }
  .entrepottable p{
    overflow: hidden;
    display: block;
    width: 100%;
  }
  .entrepottable p span{
    font-size: 12px;
    color: #999;
  }
  .entrepottable .el-table td{
    padding: 6px 0;
  }
  .home .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../assets/icon_lock.png") no-repeat;
  }
  .home .iconcode{
    float: left;
    margin-right: 10px;
    display: inline-block;
    width: 26px;
    height: 26px;
    line-height: 26px;
    color: #fff;
    text-align: center;
    background: #438dd1;
    border-radius: 50%;
    cursor: pointer;
  /*  background: url("../assets/icon_code.png") no-repeat;
    background-size: cover;*/
  }

</style>
