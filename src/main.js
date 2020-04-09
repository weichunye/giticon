import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import configUrl from './config/index.js'
import $ from 'jquery'
/*import http from './utils/request'*/
import Vuex from  'vuex'
import store from  './vuex/store'
import codemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import {Passport} from  './utils/checkLogin'
import { VueShowdown } from 'vue-showdown' // remember to import the esm build of vue-showdown, i.e. vue-showdown.esm.js
import hljs from "highlight.js"
import 'highlight.js/styles/default.css';


Vue.component('VueShowdown', VueShowdown)
Vue.config.productionTip = false
Vue.prototype.axios = axios;
Vue.prototype.config = configUrl;
Vue.use(Element)
Vue.use(Vuex)
Vue.use(codemirror)
Vue.directive('highlight',function (el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block)=>{
        hljs.highlightBlock(block)
    })
})

/*Vue.prototype.$http = http*/
/*
Vue.prototype.userStatus=1;//默认用户为普通角色，1为供应商
Vue.prototype.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1NzcyNTYwNDUsInVzZXJJZCI6OSwiaWF0IjoxNTc2NjUxMjQ1LCJlbWFpbCI6IndjeUBxcS5jb20iLCJ1c2VybmFtZSI6Iumtj-aYpemHjiJ9.sd7dHCnt-gsXUv-rytXClnKWnDXz3_lWRVD5nMF0xL7h0ksjPCB_UmIjVt3VaHuA1j-I7KfTITexysmkq1bjmw'
Vue.prototype.userInfo = {
    id: 2,
    trueName: '测试账号',
    mobile: 13333333333,
    cstnetId: '371246735@qq.com',

}*/
var option={
      umtUrl:'http://passport.escience.cn', //umt的地址，必填
      viewPort:$("#testDiv"),						//显示message的地方，可不填
       message:'haha,runing...',					//提示信息的内容，可不填
       loginclass:'miaomiao'
}
var newOption={
    target:'none',   //无作用
    appname:'dct', //应用名称
     theme:'ddl'	   //如果在umt里面有定制版，
    						}
var  passport= new Passport(option)
console.log("passport",passport)
var newPassport= passport.checkAndLogin("http://www.cstos.cstcloud.cn/csthub/web/auth/callback",newOption)
console.log("passport00",newPassport)
var userJsonStr = sessionStorage.getItem('sessionData');
var userEntity = JSON.parse(userJsonStr);
if(userEntity){
    Vue.prototype.token = userEntity.token;
    Vue.prototype.userInfo = userEntity.userInfo;
    Vue.prototype.userId = userEntity.userId;
}
Vue.prototype.token = "55f41f00fdc5f5ab62df854a595c6de7";
Vue.prototype.userId = "30";
Vue.prototype.userInfo = {
   /* cstnetId: "cclhyt@163.com",*/
    cstnetId: "371246735@qq.com",
    trueName: "魏春野666",
    isSetHttpClonePwd:1,

}
axios.interceptors.response.use(response => {
    if (response) {
        switch (response.data.code) {
            case 401: //与后台约定登录失效的返回码,根据实际情况处理
                console.log("gg")
                localStorage.clear();     //删除用户信息
                sessionStorage.clear()
                router.replace({
                    path: '/',
                })
                //如果超时就处理 ，指定要跳转的页面(比如登陆页)
        }
    }
    return response;
}, error => {
    return Promise.reject(error.response.data) //返回接口返回的错误信息
})
new Vue({
    router,
    store,
    render: h => h(App),
    created(){
    },
}).$mount('#app')
