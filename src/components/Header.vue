<template>
  <!--  <v-card>-->
  <v-app-bar app class="rounded-b-xl" absolute color="primary" >
    <v-toolbar-title :style="$vuetify.breakpoint.smAndDown ? {fontSize: '14px'} : {fontSize: '18px'}">
      <Fa :icon="faHandPeace" fw size="2x" class="secondary--text hidden-xs-only"/>
      <router-link to="/">
        <h2 class="white--text d-inline-block pl-2 pl-sm-0">{{ msg }}</h2>
      </router-link>
      <Fa :icon="faHandPeace" fw size="2x" class="secondary--text hidden-xs-only"/>
    </v-toolbar-title>
    <v-spacer/>
    <div class="white--text px-1 px-sm-3" style="text-align: end;">
      <h3 v-if="!nameEdit" class="d-inline-block pr-2">
        {{ userName }}
        <v-icon color="white" class="ml-2" @click="nameEdit = true">mdi-pencil</v-icon>
      </h3>
      <div v-else>
        <input type="text" v-model="userName" @keyup.enter="updateName" class="d-inline-block"
               style="width: 120px; background: white; border-radius: 5px; font-size: 18px; padding-left: 10px;">
        <div class="d-inline-block">
          <v-icon color="white" @click="nameEdit = false">mdi-close-thick</v-icon>
          <v-icon color="white" @click="updateName">mdi-circle-outline</v-icon>
        </div>
      </div>
    </div>
  </v-app-bar>
  <!--  </v-card>-->
</template>

<script>
import Fa from 'vue-fa'
import {faHandPaper, faHandRock, faHandPeace} from '@fortawesome/free-solid-svg-icons'

export default {
  name: "Header",
  props: {
    msg: String
  },
  components: {
    Fa
  },
  created: function () {
    // console.log("Header created");
    this.checkAuth();
  },
  data: () => ({
    onetime: true,
    userName: "名無し",
    nameEdit: false,
    faHandRock,
    faHandPaper,
    faHandPeace,
    user: null,
  }),
  methods: {
    checkAuth() {
      let self = this;
      if (!this.store.user) {
        setTimeout(() => {
          self.checkAuth();
        }, 500);
        return;
      }
      this.userName = this.store.user.displayName || "名無し";
    },
    updateName() {
      let self = this;
      if (!this.userName) {
        this.store.messages.push({text: "ユーザネームを入力してください．"});
        return;
      }
      let user = this.store.firebase.auth().currentUser;
      user.updateProfile({
        displayName: this.userName,
      }).then(function () {
        self.nameEdit = false;
      }).catch(function (error) {
        console.log(error);
        this.store.messages.push({text: "ユーザネームの更新に失敗しました．"});
      });
    }
  }
}

</script>

<style scoped lang="scss">
h1 {
  margin: 0px;
}

.header {
  color: white;
  padding: 10px;
}

</style>