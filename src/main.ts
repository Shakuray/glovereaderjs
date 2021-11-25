import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

// Vuetify's CSS styles
import 'vuetify/dist/vuetify.min.css'
import router from './router'

import { registerGlobalComponents } from './GlobalComponentsLoader';
registerGlobalComponents();

new Vue({
    vuetify,
    router,
    render: h => h(App)
}).$mount('#app')
