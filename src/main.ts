import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

// Vuetify's CSS styles
import "vuetify/dist/vuetify.min.css";

import { registerGlobalComponents } from "./GlobalComponentsLoader";
registerGlobalComponents();

new Vue({
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
