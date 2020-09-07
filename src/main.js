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
var userJsonStr;
/*userJsonStr={"flag":"1","error":"","userId":"18","token":"23d2d0ccd0b1daaeb33f839cdbe9dc92","refreshToken":"3183cc9cefd420cc2bd82363ccae3895","userInfo":{"trueName":"李健","cstnetId":"371246735@qq.com","isSetHttpClonePwd":"1"}}
userJsonStr=JSON.stringify(userJsonStr);*/
if(localStorage.getItem('sessionData')&&localStorage.getItem('sessionData')!='null'){
    console.log("localStorage.getItem('sessionData')++++++++",localStorage.getItem('sessionData'))
    userJsonStr=localStorage.getItem('sessionData')
}
if(sessionStorage.getItem('sessionData')){
    userJsonStr = sessionStorage.getItem('sessionData');
    console.log("sessionStorage.getItem('sessionData')@@@@@@@@",sessionStorage.getItem('sessionData'))
    localStorage.setItem('sessionData',userJsonStr);
    console.log("userJsonStr本地缓存没有",userJsonStr)
}
var userEntity =userJsonStr?JSON.parse(userJsonStr):null;
if(userEntity){
    Vue.prototype.token = userEntity.token;
    Vue.prototype.userInfo = userEntity.userInfo;
    Vue.prototype.userId = userEntity.userId;
  /*  window.SITE_CONFIG['token'] = userEntity.token;*/
}

console.log("userEntity++++++++++++++++",userEntity)
console.log("Vue.prototype.userId111111111111111111",Vue.prototype.userId)
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
