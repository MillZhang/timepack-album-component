import Vue from 'vue'
import Router from 'vue-router'
import Config from '@/test/Config'

import Editor_Global from '@/test/Index'
import Editor_Uploader from '@/test/Upload'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Config',
    component: Config
  }, {
    path: '/test/global',
    name: 'global',
    component: Editor_Global
  }, {
    path: '/test/upload',
    name: 'upload',
    component: Editor_Uploader
  }]
})
