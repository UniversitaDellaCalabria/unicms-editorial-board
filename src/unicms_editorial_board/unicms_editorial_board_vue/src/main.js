/*!

 =========================================================
 * Vue Light Bootstrap Dashboard - v2.0.0 (Bootstrap 4)
 =========================================================

 * Product Page: http://www.creative-tim.com/product/light-bootstrap-dashboard
 * Copyright 2019 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueBreadcrumbs from 'vue-2-breadcrumbs';
import VueRouter from 'vue-router'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// LightBootstrap plugin
// ?
import LightBootstrap from './light-bootstrap-main'

// router setup
import routes from './routes/routes'

import './registerServiceWorker'

// plugin setup
Vue.use(VueAxios, axios)
Vue.use(VueBreadcrumbs);
//Vue.use(CKEditor);
Vue.use(VueRouter)

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// ?
Vue.use(LightBootstrap)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active',
  scrollBehavior: (to) => {
    if (to.hash) {
      return {selector: to.hash}
    } else {
      return { x: 0, y: 0 }
    }
  }
})

function date_formatter(data) {
    if (!data) return null;
    let date = new Date(data);
    let options = { year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit' };
    return date.toLocaleDateString(undefined, options)
}
Vue.prototype.$date_formatter = date_formatter

function get_cookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null
}
Vue.prototype.$csrftoken = get_cookie('csrftoken');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
})


