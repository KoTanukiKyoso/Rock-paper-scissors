<template>
  <v-card class="rounded-b-xl d-block" color="primary">
    <v-row style="align-items: center;">
      <v-col cols="12" class="col-sm-7 py-sm-4 py-1 pl-5">
        <Fa :icon="faHandPeace" fw size="2x" class="secondary--text"/>
        <router-link to="/">
          <h2 class="white--text d-inline-block">{{ msg }}</h2>
        </router-link>
        <Fa :icon="faHandPeace" fw size="2x" class="secondary--text hidden-xs-only"/>
      </v-col>
      <v-col cols="12" class="col-sm-5 py-sm-4 py-1">
        <div class="white--text px-3" style="text-align: end;">
          <h3 v-if="!nameEdit" class="d-inline-block pr-2">
            {{ userName }}
            <v-icon color="white" class="ml-2" @click="nameEdit = true">mdi-pencil</v-icon>
          </h3>
          <div v-else>
            <v-text-field solo v-model="userName" @keyup.enter="updateName" class="d-inline-block"
                          style="width: 150px;"></v-text-field>
            <v-btn color="white" icon @click="nameEdit = false">
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
            <v-btn color="white" icon @click="updateName">
              <v-icon>mdi-circle-outline</v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
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