<template>
  <div style="width: 100%; height: 100%">
    <div v-if="!this.token" class="education_box" >
      <div class="education_login">
        <!--登录-->
        <span class="dltit">登 录</span>
        <div class="pass-login-covers" style="display: block;">
          <iframe src="https://passport.escience.cn/oauth2/authorize?response_type=code&redirect_uri=http://www.cstos.cstcloud.cn/csthub/web/auth/callback&client_id=94253&theme=embed">
          </iframe>
          <a  class="a-link" href="https://passport.escience.cn/regist.jsp"> 注册</a>
        </div>
        <!--登录end-->
      </div>
      <div class="login-bg-left">
      </div>
    </div>
    <div v-show="this.token" style="width: 100%; height: 100%">
    <div class="home">
      <h3>工作台</h3>
      <!--代码仓库-->
      <!--项目-->
      <div class="box box1">
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
      <div class="box box2">
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
                  label="上次更新"  width="180">
          </el-table-column>
          <!--<el-table-column  width="60"  prop="">
            <template slot-scope="scope">
              <span class="iconlock"></span>
            </template>
          </el-table-column>-->
        </el-table>
        <div class="morelink">     <router-link  :to="{path:'/projectrepositories',query:{projectType:'all'}}" >更多</router-link></div>

      </div>
      <!--//代码仓库-->
      <!--代码片段-->
      <div class="box box3">
        <el-table class="entrepottable"
                  :data="getDataList.snippetList"
                  style="width: 100%">
          <el-table-column
                  prop="name"
                  label="片段名称"
                  width="180">
            <template slot-scope="scope">
              <span class="iconcode"  @click="goToSnipper(scope.row)">{{scope.row.name.slice(0,1)}}</span>
              <h4>{{scope.row.name}}</h4>

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
    </div>

  </div>
    <el-dialog title="设置HTTP克隆独立密码"  :visible.sync="isSetHttpClonePwd" :show-close="false" :close-on-click-modal=false>
      <el-form :model="clonePwdForm"  :rules="rules4" ref="clonePwdForm">
        <el-form-item label="设置密码" prop="pwdVal" >
          <el-input type="password" v-model="clonePwdForm.pwdVal" ></el-input>
        </el-form-item>
        <el-form-item   label="确认密码" prop="pwdValRe" >
          <el-input type="password" v-model="clonePwdForm.pwdValRe" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkPwd('clonePwdForm') ">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
    // @ is an alias to /src
    export default {
        name: 'home',
        data () {
            return {
                getDataList:[],
                entrepotData:[],
                fragmentData:[],
                projectData:[],
              isSetHttpClonePwd:false,
              clonePwdForm:{
                pwdVal:'',
                pwdValRe:''
              },
              rules4: {
                pwdVal: [{ required: true,message: '请填写密码', trigger: 'blur'}],
                pwdValRe: [{ required: true,message: '请重复填写密码', trigger: 'blur'}],
              },

            }
        },

        mounted(){
            var _this=this;
          !this.token?$("#nav").hide():""
            _this.axios.defaults.headers.common['token'] = _this.token
            console.log("thie.token",_this.token)
          console.log("sessionStorage.getItem('isSetHttpClonePwd')",sessionStorage.getItem('isSetHttpClonePwd'))
          if(sessionStorage.getItem('isSetHttpClonePwd')!=1){
            this.isSetHttpClonePwd= this.userInfo.isSetHttpClonePwd=="0"?true:false;
          }
          if(_this.token){
            this.axios.post(this.config.baseURL + '/app/index/myWorkbench ')
                    .then(function (response) {
                      console.log(" this.projectData",response)
                      _this.getDataList=response.data.workbench
                      if(response.data.code!=0){
                        _this.$alert('令牌过期,请重新登录', '', {
                          confirmButtonText: '确定',
                          callback: action => {
                            sessionStorage.clear()
                            localStorage.clear();
                            location. reload()
                          }
                        });


                      }
                    })
          }
        },
        methods:{
          checkPwd(formName) {
            var _this = this;
            _this.axios.defaults.headers.common['token'] = _this.token
            var params = new URLSearchParams();
            params.append("httpClonePwd", _this.clonePwdForm.pwdVal);
            this.$refs[formName].validate((valid) => {
              if(valid){
                if(_this.clonePwdForm.pwdVal!=_this.clonePwdForm.pwdValRe){
                  _this.$message({
                    message: "两次密码需保持一致",
                    type: "warning"
                  });
                  return
                }
                _this.axios.post(this.config.baseURL + '/app/key/setHttpClonePwd', params)
                        .then(function (response) {
                          console.log("response", response)
                          if(response.data.code==0){
                            sessionStorage.setItem("isSetHttpClonePwd",1)
                            _this.isSetHttpClonePwd=false
                            _this.$message({
                              message: response.data.msg,
                              type: response.data.code == 0 ? "success" : "warning"
                            });
                          }
                        })
              }
            });
          },
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
<style>
  *{
    font-family: 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Noto Sans CJK SC', Sathu, EucrosiaUPC, Arial, Helvetica, sans-serif;
    color: #000;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  a {
    color: #42b983;
  }
  .home{
    position: relative;
    margin:15px;
    padding: 15px 30px;
    margin-left: 310px;
    height: 100%;
    background: #fff;
    border-radius: 8px;
  }
  .home h3{
    font-size: 18px;
    line-height: 40px;
    color: #666;
  }
  .home .box{
    margin: 20px 0;
    padding: 10px;
    width: 100%;

  }
  .home .box1{
    background: #f3f8fa;
  }
  .home .box1 .el-table td , .home .box1 .el-table th{
    background: #f3f8fa;
  }
  .home .box2{
    background: #f3faf4;
  }
  .home .box2 .el-table td , .home .box2 .el-table th{
    background: #f3faf4;
  }
  .home .box3{
    margin-bottom: 50px;
    background: #faf8f0;
  }
  .home .box3 .el-table td , .home .box3 .el-table th{
    background: #faf8f0;
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

  .education_box{
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-image: linear-gradient(to right, #5c3ddd , #407ee8);
    background-size: 100% 100%;
  }
  .login-bg-left{
    position: fixed;
    left: 0;
    top: 100px;
    width: 794px;
    height: 670px;
    background: url("../assets/login_bg_left.png") no-repeat;
  }

  .pass-login-covers {
    position: relative;
  }
  .pass-login-covers iframe{
    border: 0;
    width: 280px;
    height: 330px;
  }
  .a-link{
    position: absolute;
    right: 20px;
    bottom: 55px;
    font-size: 13px;
    color: #08a;
  }
  .education_login {
    width: 336px;
    min-height: 380px;
    background: #ffffff;
    position: relative;
    margin: 0 auto;
    padding: 20px 32px 30px 32px;
    -webkit-box-shadow: 0px 1px 12px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 1px 12px 0px rgba(0, 0, 0, 0.2);
    position: absolute;
    right: 15%;
    top: 15%;;
    text-align: center;
    z-index: 100;
  }

  /*表单美化*/
  .dltit {
    font-size: 18px;
    color: #333;
    width: 80px;
    display: inline-block;
    height: 30px;
    text-align: center;
    margin: 0 auto 20px;

  }

</style>
