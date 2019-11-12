import Vue from 'vue'
import App from './App.vue'
import Octokit from "@octokit/rest"
import BootstrapVue from 'bootstrap-vue'


require("dotenv").config();

const octokit = Octokit({
  auth: `token ${process.env.VUE_APP_GITHUB_TOKEN}`,
  userAgent: 'SWENG github vis'
})

// Object.definePrototype(Vue.prototype, '$octokit', { value: octokit });
Vue.prototype.$octokit = octokit
Vue.config.productionTip = false
Vue.use(BootstrapVue)

new Vue({
  render: h => h(App),
}).$mount('#app')
