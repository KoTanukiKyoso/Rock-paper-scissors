import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "./style/sass/common.scss";
import vuetify from './plugins/vuetify';
// import '@fortawesome/fontawesome-free/css/all.css'
import firebase from 'firebase/app'
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore'

// initialize Firebase
let config = {
    apiKey: "AIzaSyAHwTl1AGadZAh7T7gQMEYSjD8mZ2iXNb4",
    authDomain: "janken-8e8e5.firebaseapp.com",
    projectId: "janken-8e8e5",
    storageBucket: "janken-8e8e5.appspot.com",
    messagingSenderId: "208432098891",
    appId: "1:208432098891:web:883ee91ab9c58ddd1ce7ce",
    measurementId: "G-6GSF0WPS5P"
}

Vue.prototype.store = {
    user: null,
    messages: []
};

firebase.initializeApp(config);
firebase.analytics();

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log(user.uid);
        Vue.prototype.store.user = user;
    } else {
        firebase.auth().signInAnonymously().catch(function (error) {
            Vue.prototype.store.user = null;
            let errorCode = error.code;
            let errorMessage = error.message;
            alert(`error：${errorCode} - ${errorMessage}`);
        });
    }
});

Vue.config.productionTip = false

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
