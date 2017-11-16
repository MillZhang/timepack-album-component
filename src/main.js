// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import {
  Toast,
  MessageBox,
} from 'mint-ui';
import 'mint-ui/lib/style.css'

require('assets/css/common.css')
require('assets/js/flexible.js')

import Util from './tools/util/index.js'
import Cache from 'assets/js/Cache.js'

Vue.config.productionTip = false
Vue.prototype.utils = Util;
Vue.prototype.toast = Toast;
Vue.prototype.cache = Cache;
Vue.prototype.alert = MessageBox;
Vue.prototype.config = {};

/* eslint-disable no-new */
let app = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

window.App = app;
