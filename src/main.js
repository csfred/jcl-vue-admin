import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

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
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 百度地图
import BaiduMap from 'vue-baidu-map';
Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: 'Pbb6NyeHM46f6cgCAAKKWSSfYVf7f9n7'
})

// // 拖拽插件
// import VueDraggableResizable from 'vue-draggable-resizable'
// // optionally import default styles
// import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
// Vue.component('vue-draggable-resizable', VueDraggableResizable)

import vueDragResizeRotate from '@pinkcao/vue-drag-resize-rotate'
Vue.use(vueDragResizeRotate)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
