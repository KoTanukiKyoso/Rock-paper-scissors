import Vue from 'vue';
import Vuetify from 'vuetify/lib';
// import colors from 'vuetify/lib/util/colors'
import ja from 'vuetify/es5/locale/ja.js'
// import '@fortawesome/fontawesome-free/css/all.css'
import {library, dom} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'
// import firebase from "firebase";
library.add(far)
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
dom.watch()

Vue.prototype.store = {
    colors: {
        primary: "#f44336",
        secondary: "#ff9800",
        accent: "#000000",
        error: "#f44336",
        warning: "#ffeb3b",
        info: "#2196f3",
        success: "#4cbf50"
    }
};

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'faSvg'
    },
    lang: {
        locales: {ja},
        current: 'ja',
    },
    theme: {
        themes: {
            light: {
                primary: Vue.prototype.store.colors.primary,
                secondary: Vue.prototype.store.colors.secondary,
                accent: Vue.prototype.store.colors.accent,
                error: Vue.prototype.store.colors.error,
                warning: Vue.prototype.store.colors.warning,
                info: Vue.prototype.store.colors.info,
                success: Vue.prototype.store.colors.success
            },
        },
    },
});
