import Vue from "vue";
import Vuetify from "vuetify/lib";

//locales
import es from "vuetify/src/locale/es";
import ca from "vuetify/src/locale/ca";
import pt from "vuetify/src/locale/pt";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: { es, ca, pt },
    },
    theme: {
        dark: true,
        themes: {
            light: {
                primary: "#ed8a42",
            },
            dark: {
                primary: "#ed8a42",
            },
        },
    },
});
