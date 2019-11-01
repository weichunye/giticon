<template>
    <div>
        <div class="sidebar">
            <div class="top">
                Git-CNIC
                <i class="loginout el-icon-error" @click="loginOut"></i>
                <router-link to="messagelist">
                    <i router class="topmessage el-icon-message-solid"></i>
                </router-link>

            </div>
            <!--個人信息-->
            <div class="userinfo-box">
                <dl class="userinfo">
                    <dt>
                        <img src="../assets/photo.jpg"/>
                        <span> </span>
                    </dt>
                    <dd>
                        {{ this.$store.state.userInfo.userId }}
                    </dd>
                </dl>
                <!--新建-->
                <div v-if="newbox" class="newbox">
                    <el-button @click="newFun(1)" style="margin: 10px;display: block" type="primary" plain>创建项目
                    </el-button>
                    <el-button @click="newFun(2)" style="margin: 10px;display: block" type="primary" plain>创建仓库
                    </el-button>
                    <el-button style="margin: 10px;display: block" type="primary" plain>导入仓库</el-button>
                    <el-button @click="newFun(3)" style="margin: 10px;display: block" type="primary" plain>代码片段
                    </el-button>
                </div>
                <!--新建-->
            </div>
            <!--//个人信息-->
            <div class="center-box">
                <div @click="newbox=true" class="newproject"></div>
            </div>
            <!--导航-->
        </div>
        <!--//导航-->
        <!--新建项目-->
        <el-dialog title="新建项目" :visible.sync="dialogProjectForm">
            <el-form :model="form" :rules="rules1" ref="form">
                <el-form-item label="项目名称" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <div class="dialog-box">
                    <el-form-item label="归属" :label-width="formLabelWidth">
                        <el-select v-model="form.affiliation" placeholder="请选择活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                        /
                    </el-form-item>
                    <el-form-item label="路径" :label-width="formLabelWidth">
                        <el-input v-model="form.path" autocomplete="off"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="选择语言" :label-width="formLabelWidth">
                    <el-select size="medium" v-model="form.languageVal" placeholder="请选择">
                        <el-option
                                v-for="item in languageOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目简介" prop="desc" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item label="是否公开" :label-width="formLabelWidth">
                    <el-radio v-model="form.radio" label="1">公开</el-radio>
                    <el-radio v-model="form.radio" label="2">私有</el-radio>
                </el-form-item>
                <el-form-item>
                    <div style="display: block; text-align: center">
                        <el-button @click="resetForm('form','dialogProjectForm')">取 消</el-button>
                        <el-button type="primary" @click=" newProject('form')">确 定</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--//新建项目-->
        <!--新建仓库-->
        <el-dialog title="新建仓库" :visible.sync="dialogRepository">
            <el-form :model="projectForm" :rules="rules2" ref="projectForm" >
                <el-form-item prop="name" label="仓库名称" :label-width="formLabelWidth">
                    <el-input v-model="projectForm.name" autocomplete="off"></el-input>
                    <p style="font-size: 12px; color: #f81d22">仓库名称只允许字母、数字或者下划线(_)、中划线(-)、点(.)</p>
                </el-form-item>
                <!-- <div class="dialog-box">
                     <el-form-item label="所属项目" :label-width="formLabelWidth">
                         <el-select v-model="projectForm.affiliation" placeholder="请选择活动区域">
                             <el-option label="区域一" value="shanghai"></el-option>
                             <el-option label="区域二" value="beijing"></el-option>
                         </el-select>
                         /
                     </el-form-item>
                      <el-form-item label="路径" :label-width="formLabelWidth">
                          <el-input v-model="projectForm.path" autocomplete="off"></el-input>
                      </el-form-item>
                 </div>-->
                <!-- <el-form-item label="选择语言" :label-width="formLabelWidth">
                     <el-select size="medium" v-model="projectForm.languageVal" placeholder="请选择">
                         <el-option
                                 v-for="item in languageOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                         </el-option>
                     </el-select>
                 </el-form-item>-->
                <el-form-item prop="projectId" label="选择项目" :label-width="formLabelWidth">
                    <el-select size="medium" v-model="projectForm.projectId" placeholder="请选择">
                        <el-option
                                v-for="item in projectList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="desc" label="简介" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="projectForm.desc"></el-input>
                </el-form-item>
                <el-form-item prop="ifPublic"  label="是否公开" :label-width="formLabelWidth">
                    <el-radio v-model="projectForm.ifPublic" label="1">公开</el-radio>
                    <el-radio v-model="projectForm.ifPublic" label="2">私有</el-radio>
                </el-form-item>
                <el-form-item  :label-width="formLabelWidth">
                    <el-checkbox v-model="projectForm.isReadme">新建Readme</el-checkbox>
                </el-form-item>

                <el-form-item>
                    <div style="display: block; text-align: center">
                        <el-button  @click=" resetForm('projectForm','dialogRepository')">取 消</el-button>
                        <el-button type="primary" @click=" newRepositories('projectForm') ">确 定</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--//新建仓库-->
        <!--新建代码片段-->
        <el-dialog title="新建代码片段" :visible.sync="dialogCode">
            <el-form :model="snippetForm"  :rules="rules3" ref="snippetForm">
                <el-form-item label="标题" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="snippetForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <!--   <el-form-item label="选择语言" :label-width="formLabelWidth">
                       <el-select size="medium" v-model="projectForm.languageVal" placeholder="请选择">
                           <el-option
                                   v-for="item in languageOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                           </el-option>
                       </el-select>
                   </el-form-item>-->

                <el-form-item label="代码片段" prop="desc" :label-width="formLabelWidth">
                    <el-input v-model="snippetForm.desc" autocomplete="off" placeholder="简介"></el-input>
                    <el-input :rows="5" style="margin-top: 10px;" type="textarea" v-model="snippetForm.codeSnippet"></el-input>
                </el-form-item>
                <el-form-item label="所属类型" prop="ownerType" :label-width="formLabelWidth">
                    <el-select size="medium" v-model="snippetForm.ownerType" placeholder="请选择">
                        <el-option
                                v-for="item in ownerTypeOption"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否公开"  prop="radio"  :label-width="formLabelWidth">
                    <el-radio v-model="projectForm.radio" label="1">公开</el-radio>
                    <el-radio v-model="projectForm.radio" label="2">私有</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click=" resetForm('snippetForm','dialogCode')">取 消</el-button>
                <el-button type="primary" @click=" newSnippe('snippetForm') ">确 定</el-button>
            </div>
        </el-dialog>
        <!--//新建代码片段-->
    </div>
</template>

<script>
    export default {
        name: 'MainSidebar',
        props: {
            msg: String
        },
        data() {
            return {
                dialogProjectForm: false,//新建项目
                dialogRepository: false,//仓库
                dialogCode: false,//仓库
                formLabelWidth: '130px',
                form: {
                    name: '',
                    affiliation: '',//归属
                    desc: '',//简介,
                    path: '',//路径
                    radio: '1',
                    languageVal: '',
                },
                projectForm: {
                    name: '',
                    isReadme: 0,
                    desc: '',//简介,
                    path: '',//路径
                    projectId: '',
                    ifPublic: '1',
                    languageVal: '',
                },
                snippetForm: {
                    id:'',
                    name: '',
                    desc: '',//简介,
                    codeSnippet: '',
                    language:1,
                    ownerType:1,
                },
                ownerTypeOption:[
                    {
                        id: 1,
                        name:'个人'
                    },
                    {
                        id: 2,
                        name:'项目'
                    },

                ] ,
                languageOptions: [
                    {
                        value: '1',
                        label: '黄金糕'
                    },
                    {
                        value: '2',
                        label: '绿豆糕'
                    },
                    {
                        value: '3',
                        label: '切糕糕'
                    },
                    {
                        value: '4',
                        label: '年糕糕'
                    },
                ],
                newbox: false,
                routePath: '',
                rules1: {
                    name: [{ required: true,message: '请填写名称', trigger: 'blur'}],
                    desc: [ { required: true, message: '请填写简介',trigger: 'blur' } ],
                },
                rules2: {
                    name: [{ required: true,message: '请填写名称', trigger: 'blur'}],
                    desc: [ { required: true, message: '请填写简介',trigger: 'blur' } ],
                    projectId:[{ required: true, message: '请选择所属仓库',trigger: 'blur' }],
                    ifPublic:[{ required: true, message: '请选择',trigger: 'blur' }]

                },
                rules3: {
                    name: [{ required: true,message: '请填写名称', trigger: 'blur'}],
                    desc: [ { required: true, message: '请填写简介',trigger: 'blur' } ],
                    ownerType:[{ required: true, message: '所属类型',trigger: 'blur' }],
                    ifPublic:[{ required: true, message: '请选择',trigger: 'blur' }]

                },
                projectList:[]

            }
        },
        mounted() {

            /* console.log(" this.$store.state.userInfo)",JSON.parse(this.$store.state.userInfo).userId )*/
            console.log("this.$store.state.userInfo.userId ", this.$store.state.userInfo )
            this.routePath = this.$route.path;
            console.log(" this,routePath", this.routePath)
            if(!this.$store.state.token){
                this.$router.push({
                    name: 'login',

                })
            }

        },
        methods: {
            searchSubmit() {
                console.log('11')

            },
            newFun(e) {
                this.newbox = false;
                if (e == 1) {
                    this.dialogProjectForm = true
                }
                if (e == 2) {
                    this.getProjectList()
                    this.dialogRepository = true
                }
                if (e == 3) {
                    this.dialogCode = true
                }
            },
// 新建项目
            newProject(formName) {
                var _this = this;
                var params = {
                    "description": _this.form.desc,
                    "name": _this.form.name,
                    "ownerId": this.$store.state.userInfo.userId,
                };

                this.$refs[formName].validate((valid) => {
                    if(valid){
                        _this.axios.post(this.config.baseURL + '/app/project', params)
                            .then(function (response) {
                                console.log("response", response)
                                if(response.data.code==0){
                                    _this.$message({
                                        message: response.data.msg,
                                        type: response.data.code == 0 ? "success" : "warning"
                                    });
                                    _this.dialogProjectForm = false
                                    _this.$refs[formName].resetFields();
                                    _this.$router.go(0);
                                }
                            })
                    }

                });

            },
            // 新建仓库
            newRepositories(formName) {
                var _this = this;
                var params = {
                    "description": _this.projectForm.desc,
                    "name": _this.projectForm.name,
                    "accessLevel":_this.projectForm.ifPublic,
                    "isReadme":_this.projectForm.isReadme==true?1:0,
                    "projectId":_this.projectForm.projectId,
                    "ownerId": this.$store.state.userInfo.userId ,
                };
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        _this.axios.post(this.config.baseURL + '/app/depot/depot', params)
                            .then(function (response) {
                                console.log("response", response)
                                if(response.data.code==0){
                                    _this.$message({
                                        message: response.data.msg,
                                        type: response.data.code == 0 ? "success" : "warning"
                                    });
                                    _this.dialogRepository  = false
                                    _this.axios.defaults.headers.common['token'] = _this.$store.state.token
                                    var params1 = new URLSearchParams();
                                    params1.append("projectId", _this.projectForm.projectId);
                                    params1.append("depotId", response.data.depot.id);
                                    params1.append("ref",'master');
                                    /*  params1.append("path",_this.projectForm.name+ '/readme.md');*/
                                    params1.append("path", 'readme.md');
                                    params1.append("content", 'this readme');
                                    params1.append("msg", 'this msg');
                                    _this.axios.post(_this.config.baseURL + '/app/'+ _this.projectForm.projectId+'/'+response.data.depot.id+'/commit/master',params1)
                                        .then(function (response) {
                                            if(response.data.code==0){
                                                console.log(" 创建readme成功")
                                                _this.$refs[formName].resetFields();
                                                _this.$router.go(0);
                                            }
                                        })
                                }
                            })}
                });
            },
            // 新建代码片段
            newSnippe(formName) {
                var _this = this;
                var params = {
                    "name": _this.snippetForm.name,
                    "description":_this.snippetForm.desc,
                    "id":null,
                    "codeSnippet": _this.snippetForm.codeSnippet,
                    "language":1,
                    "ownerId": this.$store.state.userInfo.userId ,
                    "createUserId": this.$store.state.userInfo.userId ,
                    "ownerType": _this.snippetForm.ownerType,
                };
                console.log("params",formName)
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        _this.axios.post(this.config.baseURL + '/app/snippet/save', params)
                            .then(function (response) {
                                console.log("新建代码片段", response)
                                if(response.data.code==0){
                                    _this.$message({
                                        message: response.data.msg,
                                        type: response.data.code == 0 ? "success" : "warning"
                                    });
                                    _this.dialogCode  = false
                                    _this.$refs[formName].resetFields();
                                    _this.$router.go(0);
                                }
                            })}
                });

            },
            //获取项目列表
            getProjectList(){
                var _this = this;
                _this.axios.defaults.headers.common['token'] = _this.$store.state.token
                this.axios.post(this.config.baseURL + '/app/myProjectList  ')
                    .then(function (response) {
                        console.log(" response", response.data)
                        _this.projectList = response.data.list
                        if (response.data.code != 0) {
                            _this.$message({
                                message: response.data.msg,
                                type: response.data.code == "warning"
                            });
                        }
                    })
            },
            //退出登录
            loginOut(){
                var _this = this;
                _this.axios.defaults.headers.common['token'] = _this.$store.state.token
                this.axios.post(this.config.baseURL + '/app/logout')
                    .then(function (response) {
                        console.log(" response", response.data)
                        _this.$router.push({
                            name: 'login',
                            query: { }
                        })

                        if (response.data.code != 0) {
                            _this.$message({
                                message: response.data.msg,
                                type: response.data.code == "warning"
                            });
                        }
                    }).catch(function(error) {
                    console.log(error);
                    _this.$router.push({
                        name: 'login',
                        query: { }
                    })
                    localStorage.removeItem('projectId')
                    localStorage.removeItem('depotId')
                    localStorage.removeItem('projectName')
                    localStorage.removeItem('userInfo')
                    localStorage.removeItem('token')
                })
                localStorage.removeItem('projectId')
                localStorage.removeItem('depotId')
                localStorage.removeItem('projectName')
                localStorage.removeItem('userInfo')
                localStorage.removeItem('token')
            },
            //重置
            resetForm(formName,dialogEle) {
                var _this=this;
                _this.$refs[formName].resetFields();
                _this[dialogEle]=false;

            }
        }
    }
</script>
<style scoped>
    ul {
        list-style-type: none;
        padding: 0;
    }

    a {
        color: #42b983;
    }

    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 297px;
        min-height: 100%;
        background: #fff;
    }

    .sidebar .top {
        position: relative;
        width: 100%;
        height: 90px;
        line-height: 90px;
        text-align: center;
        font-size: 30px;
        letter-spacing: 2px;
        color: #fff;
        background: #3375af;
    }
    .sidebar .loginout{
        position: absolute;
        top:10px;
        right: 10px;
        font-size: 30px;
        cursor: pointer;
    }

    .sidebar .userinfo-box {
        position: relative;
        overflow: hidden;
        margin: 0;
        width: 100%;
        height: 319px;
        background: url("../assets/sidebar_bg.jpg") no-repeat;
    }

    .sidebar .userinfo {
        width: 100%;
        text-align: center;
    }

    .sidebar .userinfo dt {
        position: relative;
        margin-top: 60px;
    }

    .sidebar .userinfo dt img {
        padding: 15px;
        margin: 0 auto;
        display: block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 1px solid #8ae7f9;
    }

    .sidebar .userinfo dt span {
        position: absolute;
        top: 80px;
        right: 100px;
        width: 25px;
        height: 25px;
        background: #fff;
        border-radius: 50%;
        border: 1px solid #8ae7f9;

    }

    .sidebar .userinfo dd {
        margin-top: 15px;
        width: 100%;
        font-size: 16px;
        line-height: 26px;
        color: #fff;
        text-align: center;
    }

    .sidebar .center-box {
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 50px;
    }

    .sidebar .center-box .newproject {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 18px;
        height: 19px;
        cursor: pointer;
        background: url("../assets/icon_newproject.png") no-repeat;
    }

    .sidebar .nav-list {
        margin-top: 10px;
        width: 100%;

    }

    .sidebar .nav-list li {
        width: 100%;
        height: 56px;
    }

    .sidebar .nav-list li a {
        display: block;
        width: 100%;
        height: 100%;
    }

    .sidebar .nav-list .curli {
        color: #fff;
        background: #4396ca;
    }

    .sidebar .nav-list .curli p {
        color: #fff;
    }

    .sidebar .nav-list li:hover {
        background: #e0f4fd;
        cursor: pointer;
    }

    .sidebar .nav-list li:hover span, .sidebar .nav-list .curli span {
        background: #418cbb;
    }

    .sidebar .nav-list li:hover p {
        color: #4396ca;
        font-weight: bold;
    }

    .sidebar .nav-list li span {
        float: left;
        overflow: hidden;
        display: block;
        margin: 13px 15px 0;
        width: 28px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: #b7c0c7;
        border-radius: 50%;
    }

    .sidebar .nav-list li span img {
        display: block;
        margin: 5px 6px 0;
        width: 16px;
        height: 17px;
    }

    .sidebar .nav-list li p {
        float: left;
        font-size: 14px;
        line-height: 56px;
        color: #94a2ae;
    }

    .dialog-box {
        overflow: hidden;
        width: 100%;
    }

    .dialog-box .el-input {
        width: 200px;
    }

    .dialog-box .el-form-item {
        float: left;
    }

    .newbox {
        width: 125px;
        position: absolute;
        right: 0;
        top: 110px;
        background: #fff;
    }
    .topmessage{
        position: relative;
        top: 70px;
        right: -40px;
        width: 30px;
        height: 30px;
        color: #f3e010;
        z-index: 1001;
        cursor: pointer;
    }
</style>
