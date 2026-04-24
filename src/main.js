// 页面入口
// 作用：引入依赖及做各种资源初始化工作
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import './permission'

import '@/icons' // icon

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// element-ui样式文件引入
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
Vue.use(VXETable)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
