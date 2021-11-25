require('jsdom-global')()
global.requestAnimationFrame = cb => { return undefined as any }
window.requestAnimationFrame = cb => { return undefined as any }

import Vue from 'vue'

import Vuetify from 'vuetify';
Vue.use(Vuetify);

Vue.config.productionTip = false;
Vue.config.devtools = false;
    
import { registerGlobalComponents } from './GlobalComponentsLoader';
registerGlobalComponents()