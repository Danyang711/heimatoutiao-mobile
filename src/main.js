import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 按需注册 Vant 组件
import './utils/register-vant.js'
import 'amfe-flexible'
import './styles/index.less'
import './utils/dayjs'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
