import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/directives/v-disable';
import '@/filters/formatNumber';
Vue.config.productionTip = false;

// Setup CSS
// tslint:disable-next-line:no-var-requires
require('./assets/sass/main.scss');

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
