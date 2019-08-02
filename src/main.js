import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import fastclick from 'fastclick'
import './common/style/index.less'
// import VConsole from 'vconsole';
/* eslint-disable no-unused-vars */
// var vConsole = new VConsole();


Vue.use(VueLazyload, {
    loading: require('common/image/loading.gif')
})

Vue.config.productionTip = false
fastclick.attach(document.body)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')