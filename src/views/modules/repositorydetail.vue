<template>
  <div>
    <MainSidebar></MainSidebar>
    <CodeSidebar></CodeSidebar>
  <div class="repositorydetail">

    <el-row>
      <el-col :span="12">
        <div class="top">
         <!-- <img src="../../assets/photo.jpg"/>
          <p>项目名称  &nbsp  /</p>-->
          <h3>{{depotName}}</h3>
        </div>
      </el-col>
      <el-col :span="12"> </el-col>
    </el-row>
<!--<div class="top-box">
  <el-row :gutter="20" class="">
    <el-col :span="1">&nbsp;</el-col>
    <el-col :span="3">提交历史</el-col>
    <el-col :span="1">&nbsp;</el-col>
    <el-col :span="5">分支</el-col>
    <el-col :span="6">发布版本</el-col>
    <el-col :span="8">网址</el-col>
  </el-row>
</div>-->
    <div class="box">
      <p class="text">仓库简介</p>
    </div>
    <!--仓库基本信息-->
    <div v-if="ifNewFile==false">
      <el-row :gutter="20" class="marT-20">
        <el-col :span="3">
          <el-select size="medium" v-model="branchName" placeholder="请选择" @change="getTreeList('')">
            <el-option
                    v-for="item in branchList"
                    :key="item.simpleName"
                    :label="item.simpleName"
                    :value="item.simpleName">
            </el-option>
          </el-select>
        </el-col>
      <!--  <el-col :span="4">  <el-input v-model="projectValue"  size="medium" placeholder="输入文件名称"></el-input></el-col>
        <el-col :span="4">   <el-button type="primary" size="medium" @click="">查询</el-button></el-col>-->
        <el-col :span="4">   <el-button type="primary" size="medium" @click="ifNewFile=true" >新建文件</el-button></el-col>
        <el-col :span="4">   <el-button type="primary" size="medium" @click="sendDiolog=true" >邀请新成员</el-button></el-col>
      </el-row>

      <!--项目-->
      <div class="box">
        <div class="file-top">
          <el-row>
            <el-col :span="6">
              文件
              <!--{{webhookData.committer['name']}}-->
            </el-col>
            <el-col style="font-size: 12px; text-align: right" :span="18">
              最后一次提交：<span style="color: #1179b5"> {{webhookData.commitId}}</span> &nbsp;于&nbsp;{{webhookData.commitTime}}

            </el-col>
          </el-row>
        </div>
        <el-table class="projectData"
                  :data="treeList"
                  style="width: 100%">
          <el-table-column width="50"
                  prop="mode"
                  label="">
            <template slot-scope="scope">
              <i @click="goTreeInfo(scope.row)"  :class="[scope.row.mode=='tree'?'el-icon-folder':'el-icon-document']"></i> &nbsp;{{scope.row.fragmentName}}
            </template>
          </el-table-column>
          <el-table-column
                  prop="flatten_path"
                  label="仓库名称"
                  width="230">
          </el-table-column>
          <el-table-column
                  prop="lastCommitMessage"
                  label="描述">
          </el-table-column>
     <!--     <el-table-column
                  prop="name"
                  label="创建时间">
          </el-table-column>-->
          <el-table-column  width="180"
                  prop="lastCommitDate"
                  label="上次更新">
          </el-table-column>

        </el-table>
      </div>
      <!--//项目-->
      <div class="readme-box">
        <h4 class="readme-box-top">
          README.md
        </h4>
        <div class="readme-con">
          <codemirror  ref="myCm"  v-model="fileContent"  :options="cmOptions"   @changes="changes" class="code" ></codemirror>
        </div>

      </div>
    </div>
    <!--//仓库基本信息-->
    <!--新建文件-->
    <div v-else="">
      <el-form :model="newForm" ref="newForm" class="demo-ruleForm">
        <el-form-item>

          <el-input placeholder="请输入文件名称" v-model="newForm.fileName">
            <template slot="prepend">{{openPath}}</template>
          </el-input>
        </el-form-item>
        <el-form-item>
      <el-select style="margin-top: 20px" size="medium" v-model="branchName" placeholder="请选择">
        <el-option
                v-for="item in branchList"
                :key="item.simpleName"
                :label="item.simpleName"
                :value="item.simpleName">
        </el-option>
      </el-select>
        </el-form-item>
        <el-form-item>
      <el-input style="margin: 20px 0" v-model="newForm.fileDes" placeholder="请输入文件简介"></el-input>
        </el-form-item>
        <el-form-item>
          <codemirror  ref="myCm"  v-model="newForm.fileContent"  :options="cmOptionsNew"   @changes="changes" class="code" ></codemirror></el-form-item>
        <el-form-item>
      <div style="text-align: center; margin-top: 20px;">
        <el-button style=" width:130px" type=""  @click="resetForm('newForm')" >取消</el-button>
        <el-button style=" width: 130px" type="primary"  @click="creatNewFile" >提 交</el-button>
      </div>
        </el-form-item>
      </el-form>
    </div>
    <!--//新建文件-->
    <el-dialog title="邀请新成员" :visible.sync="sendDiolog">
      <el-form :model="sendForm">
        <el-form-item label="邀请人邮箱" >
          <el-input v-model="sendForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="授权类型">
          <el-select v-model="sendForm.authType" placeholder="请选择活动区域">
            <el-option
                    v-for="item in authTypeOption"
                    :key="item.id"
                    :label="item.val"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sendDiolog = false">取 消</el-button>
        <el-button type="primary" @click="sentMember">确 定</el-button>
      </div>
    </el-dialog>

  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CodeSidebar from '../code-sidebar.vue';
import MainSidebar from '../main-sidebar.vue';
import { codemirror } from 'vue-codemirror'
require( 'codemirror/theme/idea.css')
require("codemirror/mode/python/python.js")
require("codemirror/mode/css/css.js")
require("codemirror/mode/vue/vue.js")
require("codemirror/mode/go/go.js")
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/comment-fold.js')

export default {
  name: 'repositorydetail',
  components: {
      CodeSidebar,
      MainSidebar,
      codemirror
  },

    data () {
        return {
            webhookData:'',
            treeData:{},
            depotName:'',
            treeList:[],
            treeDetail:'',
            openPath:'',
            pathFolder:'',
            projectValue:'',
            languageVal:'',
            ifNewFile:false,
            sendDiolog:false,
            languageOptions:[ ],
            sendForm: {
                email:'',
                authType:1,

            },
            newForm:{
                fileName:'',//新建文件名称
                fileDes:'',
                fileContent:'',
            },
            fileContent:'',
            authTypeOption:[

                {  id:1,
                    val:'开发者'
                },
                {  id:2,
                    val:'测试'
                },
                {  id:3,
                    val:'游客等'
                },

            ],
            projectData:[
                {
                    ifFile:1,
                    fragmentName:'aaa',
                    ownName:'ownname',
                    name:'bbc'
                },
                {
                    ifFile:0,
                    fragmentName:'aaa',
                    ownName:'ownname',
                    name:'bbc'
                }
            ],
            branchName:'master',
            branchList:'',
            cmOptions:{
                tabSize: 4,
                mode: 'css',
                theme:"idea",
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                foldgutter: true,
                readOnly:true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
                lineWrapping: true, //代码折叠
                foldGutter: true,
                matchBrackets: true,  //括号匹配
                autoCloseBrackets: true
            },
            cmOptionsNew:{
                tabSize: 4,
                mode: 'css',
                theme:"idea",
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                foldgutter: true,
                readOnly:false,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
                lineWrapping: true, //代码折叠
                foldGutter: true,
                matchBrackets: true,  //括号匹配
                autoCloseBrackets: true
            }
        }
    },
    mounted(){
        /*this.$route.query.id;*/
        this.getBranchList()//获取分支列表
        this.getWebhookData()//获取top提交信息
        this.getdepotInfo()//获取仓库基本信息
        this.getTreeList()//获取Treelist
        console.log("localStorage.getItem('depotId')",localStorage.getItem('depotId'))
        console.log("localStorage.getItem('projectId')",localStorage.getItem('projectId'))
    },
    watch: {
        '$route'(to, from) {
            this.getBranchList()//获取分支列表
            this.getWebhookData()//获取top提交信息
            this.getdepotInfo()//获取仓库基本信息
            this.getTreeList()//获取Treelist
        }
    },
    methods:{
        //打开文件夹
        goTreeInfo(row){

            var _this=this;
            _this.openPath=row.path+"/";
            console.log(" _this.openPath", _this.openPath)
            let query = this.$router.history.current.query;
            let path = this.$router.history.current.path;
            query.t = Math.random()
            this.$router.push({ path, query: query });
            if(row.mode=='tree'){
                _this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/treeinfo/** ',{params:{
                    'depotId':localStorage.getItem('depotId'),
                    'ref':_this.branchName,
                    'path':row.path
                }})
                    .then(function (response) {
                        _this.treeList=response.data.model.infos
                        _this.pathFolder=row.flatten_path+"/"
                        console.log("  0000000", response.data)
                    })
            }else{
                this.$router.push({
                    name: 'filedetail',
                    query: {
                        'projectId': localStorage.getItem('projectId'),
                        'depotId':localStorage.getItem('depotId'),
                        'sha':row.lastCommitId,
                        'path':row.path,
                         'ref':_this.branchName
                    }
                })
            }
        },
        getTreeDetail(row){

        },
        //获取tree
        getTreeList(path){

            var _this=this;
            console.log("_this.branchName",_this.branchName)
            this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/treeinfo/** ',{params:{
                'depotId':localStorage.getItem('depotId'),
                'ref':_this.branchName,
                'path':path?path:''
            }})
                .then(function (response) {
                    _this.treeList=response.data.model.infos
                    console.log("  0000000", response.data)
                    if(response.data.code==0){
                        for(var i=0; i<_this.treeList.length; i++){
                            var cur=_this.treeList[i]
                            if(cur.path=='readme.md'){
                                //获取文件基本信息
                                var params = new URLSearchParams();
                                params.append("depotId",localStorage.getItem('depotId'));
                                params.append("sha", cur.lastCommitId);
                                params.append("path", cur.path);
                                _this.axios.post(_this.config.baseURL + '/app/entry/getByteContent ',params)
                                    .then(function (response) {
                                        _this.fileContent=response.data.data
                                        console.log("  111111", response.data)
                                    })
                            }
                        }
                    }
                })
        },
        //获取仓库基本信息
        getdepotInfo(){
            var _this=this;
            this.axios.get(this.config.baseURL + '/app/depot/'+localStorage.getItem('projectId')+'/'+localStorage.getItem('depotId'),{params:{
                'depotId':localStorage.getItem('depotId'),
                'projectId':localStorage.getItem('projectId')
            }})
                .then(function (response) {
                    _this.depotName=response.data.depot.name
                    console.log(" _this.depotName", response.data)
                })
        },
        //获取top更新信息
        getWebhookData(){
            var _this=this;
            this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/tree/** ',{params:{
                'depotId':localStorage.getItem('depotId'),
                'ref':_this.branchName,
            }})
                .then(function (response) {
                    _this.webhookData=response.data.headCommit
                    _this.webhookData.commitId= _this.webhookData.commitId.substring(0,10)

                })
        },
        //获取分支
        getBranchList(){
            var _this=this;
            console.log("depotId",_this.$route.query.depotId)
            this.axios.get(this.config.baseURL + '/app/user/*/project/*/git/'+localStorage.getItem('projectId')+'/'+localStorage.getItem('depotId')+'/refs',{params:{
                'depotId':localStorage.getItem('depotId'),
                'projectId':localStorage.getItem('projectId')
            }})
                .then(function (response) {
                    _this.branchList=response.data.refs

                })
        },
        searchSubmit () {
            console.log('11')

        },
        changes(){

        },
        resetForm(formName ){
            console.log("formName",formName)
            var _this=this;
            _this.$refs[formName].resetFields();
            this.ifNewFile=false
        },
        //新建文件pathFolder
        creatNewFile(){
                var _this=this;
              _this.axios.defaults.headers.common['token'] = _this.$store.state.token
                var params = new URLSearchParams();
                params.append("projectId", localStorage.getItem('projectId'));
                params.append("depotId",localStorage.getItem('depotId'));
                params.append("ref",_this.branchName);
                params.append("path",_this.openPath+_this.newForm.fileName);
                params.append("content", _this.newForm.fileContent);
                params.append("msg", _this.newForm.fileDes);
            _this.axios.post(this.config.baseURL + '/app/'+localStorage.getItem('projectId')+'/'+localStorage.getItem('depotId')+'/commit/'+_this.branchName,params)
                    .then(function (response) {
                        console.log(" this.000",  response)
                        var  msgType=response.data.code==0?'success':'warning'
                        _this.sendDiolog=response.data.code==0?false:true
                        _this.getTreeList()
                        _this.$message({
                            message: response.data.msg,
                            type: msgType
                        });

                    })
        },
        //邀请新成员
        sentMember(){
            var _this=this;
            _this.axios.defaults.headers.common['token'] = _this.$store.state.token
            var params = new URLSearchParams();
            params.append("authType", _this.sendForm.authType);
            params.append("depotId",localStorage.getItem('depotId'));
            params.append("depotName",_this.depotName);
            params.append("developerUserEmail",_this.sendForm.email);
            params.append("invitationUserId", this.$store.state.userInfo.userId);
            params.append("invitationUserName", this.$store.state.userInfo.username);
            var params1={

                "authType": _this.sendForm.authType,
                "depotId": localStorage.getItem('depotId'),
                "depotName": this.depotName,
                "developerUserEmail": _this.sendForm.email,
                "invitationUserId": this.$store.state.userInfo.userId,
                "invitationUserName":this.$store.state.userInfo.username

            }
            console.log("params", this.$store.state.userInfo)
            _this.axios.post(this.config.baseURL + '/app/depot/sendInvitation',params1)
                .then(function (response) {
                    console.log(" this.000",  response)
                    var  msgType=response.data.code==0?'success':'warning'
                    _this.ifNewFile=response.data.code==0?false:true
                    _this.$message({
                        message: response.data.msg,
                        type: msgType
                    });

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
  .marT-20{
    margin-top: 20px;
  }
  .repositorydetail { position: relative;
    margin:15px;
    padding: 15px 30px;
    margin-left: 310px;
    min-height: calc(100vh - 60px);
    background: #fff;
    border-radius: 8px;}
  .repositorydetail .top{
    width: 100%;
    line-height: 40px;

  }
  .repositorydetail .top img{
    float: left;
    width: 40px;
    height:40px;
    border-radius: 50%;
    border: 1px solid #dedede;
  }
  .repositorydetail .top p{
    float: left;
    margin: 0 10px;
    font-size: 14px;
    color: #999;
  }
  .repositorydetail .top h3{
    font-size: 18px;
    color: #000;
  }
  .repositorydetail .box{
    margin-top: 20px;
  }
  .repositorydetail .box .text{
    font-size:12px;
    line-height: 20px;
    color: #666;
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
  .repositorydetail .iconlock{
    display: block;
    margin: 5px 10px;
    width: 12px;
    height:16px;
    background: url("../../assets/icon_lock.png") no-repeat;
  }
  .repositorydetail i{
    font-size: 20px;
    cursor: pointer;
  }
  .readme-box{
    margin-top: 20px;
    width: 100%;
    border:1px solid #dedede;
  }
  .readme-box-top{
    height: 40px;
    line-height: 40px;
    font-style: 14px;
    text-indent: 20px;
    background: #eaecf0;

  }
  .readme-con{
    width: 100%;
    font-size: 12px;
    line-height: 16px;
    color: #666;
  }
  .vue-codemirror{
    border:1px solid #dedede;
  }
  .file-top{
    padding: 10px;
    background: #e6f0fa;
  }
  .top-box{
    margin: 20px 0 0 0 ;
    padding: 10px;
    font-size: 14px;
    line-height: 20px;
    background: #f1f2f4;
    border:1px solid #d9dbe0;
  }
</style>
