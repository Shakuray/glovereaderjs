import Vue from 'vue';
import Vuetify from 'vuetify/lib';

//locales
import es from 'vuetify/src/locale/es'
import ca from 'vuetify/src/locale/ca'
import pt from 'vuetify/src/locale/pt'

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: { es, ca, pt }
    },
    theme:{
        dark : false,
        themes: {
            light: {
                primary : '#224d86'
            },
            dark: {
                primary : '#224d86'
            }
        }
    }
});
