<template>
  <v-main>
    <v-container>
      <v-row>
        <router-link to="/rooms">
          <Fa :icon="faArrowLeft" fw size="lg"/>
        </router-link>
        <v-spacer></v-spacer>
        <v-btn text x-large @click="exitRoom" color="primary" class="font-weight-bold">退出する</v-btn>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-card style="text-align: center;" :class="{
                'display-3': $vuetify.breakpoint.smAndDown,
                'display-4': $vuetify.breakpoint.mdAndUp
              }">
            <v-icon style="font-size: inherit;">fas fa-hand-rock</v-icon>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import Fa from "vue-fa";
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

export default {
  name: 'battleRoom',
  components: {
    Fa
  },
  data: () => ({
    faArrowLeft,
    db: null,
    roomData: {},
    roomId: "",
  }),
  created: function () {
    this.db = this.store.firebase.firestore();
    this.intoRoom();
  },
  methods: {
    async intoRoom() {
      let self = this;
      let gets = this.GetURLGet();
      if (!gets.id) {
        this.store.messages.push(
            {text: "不正な遷移です．"}
        );
        await this.$router.push("/rooms");
        return;
      }
      this.roomId = gets.id;
      this.db.collection("rooms").doc(gets.id)
          .onSnapshot(function (doc) {
            self.roomData = doc.data();
            self.checkRoom();
          }, async function (error) {
            console.log(error);
            this.store.messages.push(
                {text: "入室に失敗しました．"}
            );
            await this.$router.push("/rooms");
            return;
          });
    },
    async checkRoom(){
      if (!this.roomData) {
        this.store.messages.push(
            {text: "部屋が存在しないか削除済みです．"}
        );
        await this.$router.push("/rooms");
        return;
      }

      //入室確認

      //入室してない場合空きがあって鍵部屋でなければ入室

      //それ以外は退出 エラー表示
    },
    GetURLGet() {
      let url = location.href;
      let result = {};
      // 最初の1文字 (?記号) を除いた文字列を取得する
      let query = url.split("?");
      if (query.length < 2) {
        return result;
      }
      query = query[1];
      // クエリの区切り記号 (&) で文字列を配列に分割する
      let parameters = query.split('&');
      for (let i = 0; i < parameters.length; i++) {
        // パラメータ名とパラメータ値に分割する
        let element = parameters[i].split('=');
        let paramName = decodeURIComponent(element[0]);
        let paramValue = decodeURIComponent(element[1]);

        // パラメータ名をキーとして連想配列に追加する
        result[paramName] = paramValue;
      }
      return result;
    },
    exitRoom() {

    }
  }
}
</script>
