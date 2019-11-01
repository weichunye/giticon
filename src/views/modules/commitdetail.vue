<template>
  <div>
    <MainSidebar></MainSidebar>
    <CodeSidebar></CodeSidebar>
  <div class="commitdetail">
    <h3>提交记录</h3>

    <div class="block" style="margin-top: 20px">
      <el-timeline>
        <el-timeline-item v-for="item in cordList"  :timestamp="item.commitDate" placement="top">
          <el-card>
            <h4>{{item.shortMessage}}</h4>
            <p>{{item.committer.name}} 提交于 {{item.commitDate}} <span style="float: right">{{item.sha}}</span> </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

  </div>


  </div>
</template>

<script>
// @ is an alias to /src
import MainSidebar from '../main-sidebar.vue';
import CodeSidebar from '../code-sidebar.vue';
export default {
  name: 'commitdetail',
  components: {
      MainSidebar,
      CodeSidebar
  },
    data () {
        return {
            dialogFormBranch:false,
            branchValue:'',
            cordData:[],
            cordList:'',
            page:1,
            limit:5,
            branchName:'master'
        }
    },
    mounted(){
      this.getCordList()
    },
    methods:{
      //搜索提交
        searchSubmit () {
            console.log('11')
        },
        getCordList(){
            var _this = this;
            /*this.$route.query.id;*/
           /* _this.axios.defaults.headers.common['token'] = _this.$store.state.token*/
            var params = new URLSearchParams();
            params.append("depotId",localStorage.getItem('depotId'));
            params.append("page", _this.page);
            params.append("limit", _this.limit);
            params.append("ref", _this.branchName);
            params.append("path", '');
            _this.axios.post(this.config.baseURL + '/app/depot/getCommits', params)
                .then(function (response) {
                    console.log(" response", response.data)
                    _this.cordData=response.data.pageList;
                    _this.cordList=response.data.pageList.records

                })
        },

        //行点击事件
        goToPositores (row, event, column) {
            console.log(row)
            this.$router.push({
                name: 'projectrepositories',
                query: {
                    'id':row.id,
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


  .commiterecord{
    position: relative;
    margin:15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;
  }
  .commiterecord h3{
    font-size: 18px;
    line-height: 40px;
    color: #666;
  }
  .commiterecord .box{
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
  .commiterecord .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }
  .commiterecord .iconcode{
    float: left;
    margin-right: 10px;
    display: inline-block;
    width: 26px;
    height: 26px;
    background: url("../../assets/icon_code.png") no-repeat;
    background-size: cover;
  }
  .commiterecord .menmerList{
    width: 100%;
    display: block;
    overflow: hidden;
    color: #333;
    font-size: 14px;
    line-height: 50px;
    border-bottom: 1px solid #dedede;
  }
  .commiterecord .menmerList dt{
    float: left;

  }
  .commiterecord .menmerList dd{
    float: right;
    margin-right: 10px;
  }

</style>
