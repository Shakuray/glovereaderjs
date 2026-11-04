import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import { en, es, ca, pt } from "vuetify/locale";

export default createVuetify({
    locale: {
        locale: "en",
        fallback: "en",
        messages: { en, es, ca, pt },
    },
    theme: {
        defaultTheme: "dark",
        themes: {
            light: { colors: { primary: "#ed8a42" } },
            dark: { colors: { primary: "#ed8a42" } },
        },
    },
});
