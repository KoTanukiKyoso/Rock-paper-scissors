import Vue from 'vue';
import Vuetify from 'vuetify/lib';
// import colors from 'vuetify/lib/util/colors'
import ja from 'vuetify/es5/locale/ja.js'

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: {ja},
        current: 'ja',
    },
    theme: {
        themes: {
            light: {
                // primary: colors.red.darken1, // #E53935
                // secondary: colors.red.lighten4, // #FFCDD2
                // accent: colors.indigo.base, // #3F51B5
                // primary: '#1976D2',
                // secondary: '#424242',
                // accent: '#82B1FF',
                // error: '#FF5252',
                // info: '#2196F3',
                // success: '#4CAF50',
                // warning: '#FFC107',

                // primary: "#e91e63",
                // secondary: "#922242",
                // accent: "#f95e93",
                // error: "#f44336",
                // warning: "#ffc107",
                // info: "#2196f3",
                // success: "#4caf50"

                primary: "#e91e63",
                secondary: "#ff9800",
                accent: "#000000",
                error: "#f44336",
                warning: "#ffeb3b",
                info: "#2196f3",
                success: "#4caf50"
            },
        },
    },
});
