<template>
    <div class="search">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="项目" name="first">
          <el-table class="projectData"
                    :data="projectList"
                    style="width: 100%"   >
            <el-table-column
                    label="项目名称"
                    width="180">
              <template slot-scope="scope">
                <span class="iconcode" @click="goToProjects(scope.row)">{{scope.row.name.slice(0,1)}}</span>
                <p>{{scope.row.name}}</p>
              </template>
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="项目描述">
            </el-table-column>
            <el-table-column  width="80"
                              prop="depotNum"
                              label="代码仓库">
            </el-table-column>
            <el-table-column width="80"
                             prop="snippetNum"
                             label="代码片段">
            </el-table-column>
            <el-table-column width="80"
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
        </el-tab-pane>
        <el-tab-pane label="仓库" name="second">
          <el-table class="projectData"
                    :data="depotList"
                    style="width: 100%">
            <el-table-column
                    prop="fragmentName"
                    label="仓库名称"
                    width="230">
              <template slot-scope="scope">
                <span class="iconcode"  @click="goToDetail(scope.row)">{{scope.row.name.slice(0,1)}}</span>
                <p>{{scope.row.name}}</p>
              </template>

            </el-table-column>
            <el-table-column
                    prop="description"
                    label="描述">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间">
              <template slot-scope="scope">
                {{scope.row.createTime.substring(0,10)}}
              </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="上次更新">
              <template slot-scope="scope">
                {{scope.row.lastUpdateTime}}
              </template>
            </el-table-column>
            <!--     <el-table-column width="120" prop="">
                     <template slot-scope="scope">
                         <span  style="float: left" class="iconlock"></span>
                     &lt;!&ndash;    <el-button plain size="small">修改</el-button>&ndash;&gt;
                     </template>
                 </el-table-column>-->
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="代码片段" name="third">
          <el-table class="projectData"
                    :data="snippetList"
                    style="width: 100%"    >
            <el-table-column
                    label="片段名称"
                    width="180"   prop="name">
              <template slot-scope="scope">
                <span class="iconcode" @click="goToPositores(scope.row)"> {{scope.row.name.slice(0,1)}}</span>
                <p>{{scope.row.name}}</p>
              </template>
            </el-table-column>
            <el-table-column
                    prop="username"
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
                    prop="updateTime"
                    label="上次更新">
              <template slot-scope="scope">
                {{scope.row.updateTime.substring(0,10)}}
              </template>
            </el-table-column>
            <el-table-column  width="60"  prop="lastUpdateTime">
              <template slot-scope="scope">
                <!-- <span class="iconlock"></span>-->
                <el-button type="danger" @click="delSnippet(scope.row)" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  // @ is an alias to /src
  export default {
    name: 'SearchPage',
    data () {
      return {
        activeName: '',
        page:1,
        limit:10,
        total:'',
        dataLisr:'',
        activeName:'first',
        projectList:'',
        depotList:'',
        snippetList:'',
      }
    },
    mounted(){
      this.getSearchData()
      /*this.$route.query.id;*/
    },
    watch: {
      '$route'(to, from) {
        this.getBranchList()//获取分支列表
      }
    },
    methods:{
      handleClick(tab, event) {
        console.log(tab, event);
    },
      //行点击事件
      goToProjects (row, event, column) {
        var _this=this;
        console.log(row)
        _this.$store.commit('getDepotId', row.id)
        this.$router.push({
          name: 'projectrepositories',
          query: {
            'projectId':row.id,
            'projectName':row.name
          }
        })
      },
      goToDetail(row, event, column) {
        var _this=this
        console.log("_this.$route.query.id",row)
        this.$router.push({
          name: 'repositorydetail',
          query: {
            'projectId':row.projectId,
            'depotId':row.id,

          }
        })
      },
      //行点击事件
      goToPositores (row) {
        var _this=this;
        console.log(row)
        this.$router.push({
          name: 'snipperdetails',
          query: {
            snippetsId:row.id
          }

        })
      },
      getSearchData(e){
        var _this=this;
        var params = new URLSearchParams();
        params.append("keyword", _this.$route.query.keyword);
        _this.axios.post(_this.config.baseURL + '/app/index/search',params)
                .then(function (response) {
                  _this.projectList=response.data.search.projectList
                  _this.depotList=response.data.search.depotList
                  _this.snippetList=response.data.search.snippetList
                  console.log("222222222",response.data)
                })
      },
      //分页
      pageSizeChangeHandle(val) {
        this.page = 1
        this.limit = val
        this.getDataList()
      },
      // 分页, 当前页
      pageCurrentChangeHandle(val) {
        this.page = val
        this.getDataList()
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
  .marT-20{
    margin-top: 20px;
  }
  .search {
    position: relative;
    margin: 80px 15px 15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;}
  .iconcode{
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
