<template>
  <div>
  <div class="commiterecord">
    <h3>合并请求列表</h3>
    <el-row>
      <el-col :span="14">
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="searchName"  size="medium" placeholder="输入搜索名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="getDataList">查询</el-button>
      </el-form-item>
    </el-form>
      </el-col>
      <el-col :span="10">
        <el-button style="float: right" type="primary" @click=" dialogCreatMerge=true">新建合并请求</el-button>
      </el-col>
    </el-row>
    <div class="block" style="margin-top: 20px">
          <el-card  style="margin-top: 10px"  v-for="item in mergeList" >
            <div slot="header" class="clearfix">
              <span  >{{item.title}}</span>
              <el-button  type="warning" plain  size="small" style="float: right; margin-left: 10px"  @click="closeMerge(item.id)">关闭合并</el-button>
              <el-button  type="primary" plain  size="small" style="float: right; " @click="mergeInfo(item)" >确认合并</el-button>
            </div>
            <div>
              {{item.description}}
            </div>
          </el-card>
    </div>
    <div  style="margin-top: 20px; text-align: center">
      <el-pagination @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle" :current-page="page"
                     background  :page-size="limit"   layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>

    <el-dialog title="合并请求信息" :visible.sync="dialogMergeInfo" :close-on-click-modal=false>
      <div>
        <p> {{mergeInfoData.title}}</p>
        <p> {{mergeInfoData.description}}</p>
        <p><span> 源分支：{{mergeInfoData.sourceBranch}}</span><span style="margin-left: 10px">目标分支{{mergeInfoData.distBranch}}</span></p>
        <p> </p>
        <textarea style="width: 100%; min-height: 100px" v-model="auditResult"></textarea>
        <p><el-checkbox v-model="checked">是否Fast-Forward 模式合并</el-checkbox></p>
      </div>

          <div style="display: block; text-align: center">
            <el-button  @click=" resetForm()">取 消</el-button>
            <el-button type="primary" @click="agreeMerge()">确 定</el-button>
          </div>
    </el-dialog>
    <el-dialog title="新建合并请求" :visible.sync="dialogCreatMerge" :close-on-click-modal=false>
      <el-row :gutter="10" class="marT-20">
        <el-col :span="4">
          <el-select size="medium" v-model="sourceBranch" placeholder="请选择" @change="changeBranch()">
            <el-option
                    v-for="item in branchList"
                    :key="item.simpleName"
                    :label="item.simpleName"
                    :value="item.simpleName">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select size="medium" v-model="distBranch" placeholder="请选择" @change="changeBranch()">
            <el-option
                    v-for="item in branchList"
                    :key="item.simpleName"
                    :label="item.simpleName"
                    :value="item.simpleName">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="ifCanMerge">
          <p >可以合并</p>
        </el-col>
        <el-col :span="4" v-else>
          <p>不可自动合并</p>
        </el-col>

      </el-row>
      <el-form :model="mergeForm" :rules="rules2" ref="mergeForm" >
        <el-form-item prop="name" label="请输入合并请求标题" >
          <el-input v-model="mergeForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="desc" label="描述内容" >
          <el-input type="textarea" v-model="mergeForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="选择审核人" prop="ownerType" >
          <el-select size="medium" v-model="mergeForm.ownerType" placeholder="请选择">
            <el-option
                    v-for="item in memberLisr"
                    :key="item.userId"
                    :label="item.username"
                    :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="display: block; text-align: center">
            <el-button  @click=" resetForm('projectForm','dialogRepository')">取 消</el-button>
            <el-button type="primary" @click=" crearMerge('mergeForm') ">确 定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import MainSidebar from '../main-sidebar.vue';
import CodeSidebar from '../code-sidebar.vue';
export default {
  name: 'MergeList',
  components: {
      MainSidebar,
      CodeSidebar
  },
    data () {
        return {
          title:'',
          dialogCreatMerge:false,
          dialogMergeInfo:false,
          sourceBranch:'master',//源分支
          distBranch:'master',//目标分支
          branchList:'',
          ifCanMerge:false,
          mergeForm:{
            name:'',
            desc:'',
            ownerType:''
          },
          rules2: {
            name: [{ required: true,message: '请填写名称', trigger: 'blur'}],
            desc: [ { required: true, message: '请填写简介',trigger: 'blur' } ],
            ownerType: [ { required: true, message: '请选择审核人',trigger: 'blur' } ],
          },
          searchName:'',//查询名称
          memberLisr:'',
           mergeList:'',
          page:1,
          limit:10,
          total:0,
          mergeInfoData:{},
          checked:false,
          auditResult:""
        }
    },
    mounted(){
      this.depotId=this.$route.query.depotId;
      this.projectId=this.$route.query.projectId;
      this.getBranchList()//获取分支列表
      this.changeBranch()
      this.getDepotMember()
      this.gemergeList()
    },
    methods:{
    //查询
      getDataList(){
        this.page=1
        this.gemergeList()

      },

      //获取提交文件列表
      gemergeList(){
        var _this=this;
        _this.axios.get(_this.config.baseURL + '/app/pullReq/list',{params:{
            "title":_this.searchName,
            "page":_this.page,
            "limit":_this.limit

          }})
                .then(function (response) {
                  _this.mergeList=response.data.page.list
                  _this.total=response.data.page.totalCount
                  console.log(" response222", response)
                })
      },
      agreeMerge(){
        var _this=this;
        _this.axios.defaults.headers.common['token'] = _this.token
        var params = new URLSearchParams();
        params.append("mergeId",_this.mergeInfoData.id);
        params.append("depotId",_this.$route.query.depotId);
        params.append("srcBranch",_this.mergeInfoData.distBranch);
        params.append("targetBranch",_this.mergeInfoData.sourceBranch);
        params.append("fastforward",_this.checked);
        params.append("auditResult",_this.auditResult);
        _this.axios.post(_this.config.baseURL + '/app/pullReq/confirmPullRequest',params)
                .then(function (response) {
                  _this.$message({
                    message: response.data.msg,
                    type: response.data.code == 0 ? "success" : "warning"
                  });
                  if(response.data.code==0){
                    _this.dialogMergeInfo=false
                  }
                })
           },
      closeMerge(id){
        var _this=this;
        _this.axios.defaults.headers.common['token'] = _this.token
        var params = new URLSearchParams();
        params.append("mergeId",id);
        _this.axios.post(_this.config.baseURL + '/app/pullReq/cancelPullRequest',params)
                .then(function (response) {
                  _this.$message({
                    message: response.data.msg,
                    type: response.data.code == 0 ? "success" : "warning"
                  });

                })
      },
        mergeInfo(item){
        var _this=this
          _this.mergeInfoData=item
          _this.dialogMergeInfo=true
        console.log("item",item)

      },
      resetForm(){
        this.dialogMergeInfo=false
        this.dialogCreatMerge=false
      },
      changeBranch(e){
        var _this=this;
        var params = new URLSearchParams();
        params.append("depotId", _this.depotId);
        params.append("srcBranch",_this.sourceBranch);
        params.append("targetBranch", _this.distBranch);
        _this.axios.post(_this.config.baseURL + '/app/pullReq/canMerge',params)
                .then(function (response) {
                  if(response.data.data=="ALREADY_MERGED"){
                    console.log("ALREADY_MERGED")
                    _this.ifCanMerge=true

                  }
                })
      },
      //穿件合并请求
      crearMerge(formName){
        var _this=this;
        this.$refs[formName].validate((valid) => {
          if(valid){
            _this.axios.defaults.headers.common['token'] = _this.token
            this.axios.post(this.config.baseURL + '/app/pullReq/createPullRequest',{
              "auditUserId": _this.mergeForm.ownerType,
              "depotId": 68,
              "description": _this.mergeForm.name,
              "distBranch": _this.sourceBranch,
              "sourceBranch": _this.sourceBranch,
              "title": _this.mergeForm.desc
            })
                    .then(function (response) {
                      _this.$message({
                        message: response.data.msg,
                        type: response.data.code == 0 ? "success" : "warning"
                      });
                      _this.dialogCreatMerge=false
                    })
          }})

      },
      //获取分支
      getBranchList(){
        var _this=this;
        console.log("depotId",_this.$route.query.depotId)
        this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/'+_this.projectId+'/'+_this.depotId+'/refs',{params:{
            'depotId':_this.depotId,
            'projectId':_this.projectId
          }})
                .then(function (response) {
                  _this.branchList=response.data.refs
                })
      },
      //仓库成员
      getDepotMember(){
        var _this=this;
        _this.axios.defaults.headers.common['token'] = _this.token
        var params = new URLSearchParams();
        params.append("page", _this.page);
        params.append("limit", _this.limit);
        params.append("userName", '');
        params.append("depotId", _this.depotId);
        this.axios.post(this.config.baseURL + '/app/depot/getDepotUserList',params)
                .then(function (response) {
                  console.log("=response.data",response.data)
                  _this.memberLisr=response.data.pageList.records

                })
      },
      //分页
      pageSizeChangeHandle(val) {
        this.page = 1
        this.limit = val
        this.gemergeList()
      },
      // 分页, 当前页
      pageCurrentChangeHandle(val) {
        this.page = val
        this.gemergeList()
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
  .commiterecord .imgbor{
    float: left;
    margin: 5px 10px 0 0;
    width: 36px;
    height:36px;
    color: #fff;
    line-height: 36px;
    text-align: center;
    background: #195487;
    border-radius: 50%;
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
