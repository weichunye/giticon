import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import configUrl from './config/index.js'
import $ from 'jquery'
import Vuex from  'vuex'
import store from  './vuex/store'
import codemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'


Vue.config.productionTip = false
Vue.prototype.axios = axios;
Vue.prototype.config = configUrl;
Vue.use(Element)
Vue.use(Vuex)
Vue.use(codemirror)
Vue.prototype.userInfo=''




new Vue({
  router,
    store,
  render: h => h(App),
created(){
    if(localStorage.getItem('userInfo')===null){
      localStorage.setItem('userInfo','')
    }
    else{
        this.$store.state.userInfo=JSON.parse(localStorage.getItem('userInfo'))
        this.$store.state.token=JSON.parse(localStorage.getItem('token'))
        console.log("his.$store.state.userInfo",this.$store.state.userInfo)
        console.log("kkkkkkkkkk",localStorage.getItem('userInfo'))
    }

    },
}).$mount('#app')
