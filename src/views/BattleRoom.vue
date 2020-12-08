<template>
  <v-main>
    <v-container v-if="Object.keys(roomData).length > 0">
      <v-row class="px-2">
        <router-link to="/rooms">
          <Fa :icon="faArrowLeft" fw size="lg"/>
        </router-link>
        <v-spacer></v-spacer>
        <v-btn v-if="isOwner" rounded
               text x-large @click="closeRoom" color="secondary" class="font-weight-bold">部屋を解散
        </v-btn>
        <v-btn v-else text x-large @click="exitRoom" color="primary" class="font-weight-bold">退出する</v-btn>
      </v-row>
      <v-row class="px-2">
        <div class="d-inline-block pr-5">
          参加人数：
          <span class="font-weight-bold primary--text">
            {{ roomData.children.length }}/{{ roomData.numOfChildren }}
          </span>
        </div>
        <div class="d-inline-block pr-5">
          状態：
          <span v-if="roomData.recruitment" class="font-weight-bold primary--text">
            参加者募集中
          </span>
          <span v-else class="font-weight-bold primary--text">
            参加締め切り
          </span>
        </div>
        <v-spacer></v-spacer>
        <div v-if="roomData.now" class="d-inline-block pr-2">
          第 <span class=" font-weight-bold primary--text">{{ roomData.now }}</span> 回戦
        </div>
      </v-row>
      <div v-if="isOwner" class="ma-4">
        <v-row>
          <h2>あなたが親です</h2>
          <v-col cols="12">
            <v-btn v-if="roomData.recruitment" x-large color="primary">募集を締め切る</v-btn>
            <v-btn v-else-if="roomData.now < roomData.numOfBattle" x-large color="primary">次のじゃんけんに進む</v-btn>
            <v-btn v-else-if="roomData.now >= roomData.numOfBattle" x-large color="primary">対戦を終了する</v-btn>
          </v-col>
        </v-row>
      </div>
      <div v-else>

      </div>
      <v-row v-if="roomData.now > 0">
        <v-col cols="4" v-for="(hand, key) of hands" :key="key" v-ripple>
          <v-card style="text-align: center; border-style: solid; border-width: 4px;" shaped elevation="5"
                  :style="{borderColor: hand.color, color: hand.color}"
                  class="py-10 " :class="{
                'display-3': $vuetify.breakpoint.smAndDown,
                'display-4': $vuetify.breakpoint.mdAndUp
              }">
            <v-icon style="font-size: inherit; color: inherit;">{{ hand.icon }}</v-icon>
          </v-card>
        </v-col>
      </v-row>
      <v-row style="max-width: 500px;">
        <v-col cols="12">
          <v-card class="ma-5 mx-auto" style="min-height: 300px;">
            <v-card-title class="font-weight-bold pb-1">チャット</v-card-title>
            <v-divider/>
            <div id="chatContainer" class="px-3 py-1" style="height: 300px; overflow-y: auto;">
              <v-card v-for="message of messages" :key="message.key" class="my-1">
                <v-card-title v-if="store.user.uid == message.uid" class="py-2">
                  <v-avatar color="primary" size="30">
                    <span class="white--text subtitle-2">自</span>
                  </v-avatar>
                  <span class="px-2 subtitle-1 font-weight-bold">あなた</span>
                </v-card-title>

                <v-card-title v-else-if="roomData.owner == message.uid" class="py-2">
                  <v-avatar color="secondary" size="30">
                    <span class="white--text subtitle-2">親</span>
                  </v-avatar>
                  <span class="px-2 subtitle-1 font-weight-bold">オーナー</span>
                </v-card-title>

                <v-card-title v-else class="py-2">
                  <v-avatar color="indigo" size="30">
                    <span class="white--text subtitle-2">{{ message.name }}</span>
                  </v-avatar>
                  <span class="px-2 subtitle-1">{{ message.uid }}</span>
                </v-card-title>

                <v-card-text>
                  <span v-for="(line, i) of message.text.split(/\r?\n/g)" :key="i">{{ line }}<br></span>
                </v-card-text>
              </v-card>
            </div>

            <v-divider></v-divider>
            <v-card-actions>
              <v-row class="px-2">
                <v-col cols="12" class="py-1">
                  <v-avatar color="primary" size="30">
                    <span class="white--text subtitle-2">自</span>
                  </v-avatar>
                  あなた
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-textarea v-model="chatText" @keyup.ctrl.enter="postChat" hint="Ctrl + Enter で投稿"
                              :rules="[rules.required]" filled rows="1" label="投稿テキスト" auto-grow counter></v-textarea>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="info darken-2" @click="postChat">投稿</v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-card-actions>
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
    hands: {
      rock: {
        name: "グー",
        color: "#f44336",
        icon: "fa-hand-rock"
      },
      scissors: {
        name: "チョキ",
        color: "#ff9800",
        icon: "fa-hand-peace"
      },
      paper: {
        name: "パー",
        color: "#2196f3",
        icon: "fa-hand-paper"
      },
    },
    faArrowLeft,
    db: null,
    roomData: {},
    roomId: "",
    isOwner: false,
    onetime: true,
    onetime2: true,
    show1: false,
    rules: {
      required: value => !!value || '必須入力.',
      // min: v => v.length >= 8 || 'Min 8 characters',
      // emailMatch: () => ('The email and password you entered don\'t match'),
    },
    chatText: "",
    messages: [],
  }),
  created: function () {
    this.roomData = {};
    this.messages = [];
    this.onetime = true;
    this.onetime2 = true;
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
      await this.db.collection("rooms").doc(gets.id)
          .onSnapshot(function (doc) {
            self.roomData = doc.data();
            if (self.onetime) {
              self.onetime = false;
              self.checkRoom();
            }
            self.onChangeRoomState();
          }, async function (error) {
            console.log(error);
            this.store.messages.push(
                {text: "入室に失敗しました．"}
            );
            this.$router.push("/rooms");
            return;
          });
    },
    async checkRoom() {
      if (!this.roomData) {
        this.store.messages.push(
            {text: "部屋が存在しないか削除済みです．"}
        );
        await this.$router.push("/rooms");
        return;
      }

      //既入室確認
      if (this.roomData.owner == this.store.user.uid) {
        this.isOwner = true;
        this.listenMessage();
        return;
      }
      if (this.roomData.children.includes(this.store.user.uid)) {
        this.listenMessage();
        return;
      }

      //入室してない場合空きがあって鍵部屋でなければ入室
      if (this.roomData.lock || this.roomData.children.length >= this.roomData.numOfChildren) {
        this.store.messages.push(
            {text: "この部屋は既に一杯です．"}
        );
        await this.$router.push("/rooms");
        return;
      }

      //入室処理
      let self = this;
      //登録
      let res = this.db.doc('rooms/' + this.roomId).update({
        children: self.store.firebase.firestore.FieldValue.arrayUnion(self.store.user.uid),
      }).then(function () {
        return true;
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (!res) {
        this.store.messages.push({text: "入室に失敗しました．通信が混雑している可能性があります．"});
        await this.$router.push("/battleRoom?id=" + this.roomId);
        return;
      }

      //チャット取得処理
      this.listenMessage();
    },
    listenMessage() {
      let self = this;
      this.db.collection("messages").where("room", "==", this.roomId)
          .orderBy("timestamp", "desc").limit(100)
          .onSnapshot(function (querySnapshot) {
            let messages = [];
            querySnapshot.forEach(function (doc) {
              let data = doc.data();
              data.key = doc.id;
              messages.unshift(data);
            });
            self.messages = messages;
            self.$nextTick(function () {
              let container = this.$el.querySelector("#chatContainer");
              container.scrollTop = container.scrollHeight;
            })
          });
    },
    async onChangeRoomState() {
      console.log("state changed");
      if (!this.roomData && this.onetime2) {
        this.onetime2 = false;
        this.store.messages.push(
            {text: "オーナーによって解散されました．"}
        );
        this.$router.push("/rooms");
        return;
      }
    },
    async postChat() {
      if (!this.chatText) {
        return;
      }
      let res = await this.db.collection("messages").add({
        room: this.roomId,
        uid: this.store.user.uid,
        name: this.store.user.uid.substr(0, 2),
        text: this.chatText,
        timestamp: this.store.firebase.firestore.FieldValue.serverTimestamp(),
      }).then(function (ref) {
        return {ref: ref};
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (res) {
        this.chatText = "";
      } else {
        this.store.messages.push({text: "送信に失敗しました．送信に失敗した可能性があります．"});
      }
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
    async closeRoom() {
      if (this.roomData.owner != this.store.user.uid) {
        return;
      }
      let rr = await this.$swal(
          {
            title: "本当に部屋を解散しますか？",
            html: "参加者，チャットデータは全て削除されます．過去の対戦結果は削除されません．",
            icon: "question",//"success", "error", "warning", "info" or "question"
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "解散する"
          }
      ).then((result) => {
        if (result.value) {
          return true;
        } else {
          return false;
        }
      });
      if (!rr) {
        return;
      }
      let res = this.db.doc('rooms/' + this.roomId).delete().then(function () {
        return true;
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (res) {
        // this.store.messages.push(
        //     {text: "部屋を解散しました．"}
        // );
        // await this.$router.push("/rooms");
        return;
      } else {
        this.store.messages.push(
            {text: "部屋の解散に失敗しました．"}
        );
        return;
      }
    },
    async exitRoom() {
      let rr = await this.$swal(
          {
            title: "本当に部屋を退出しますか？",
            html: "一度退出すると再度入室できない可能性があります．",
            icon: "question",//"success", "error", "warning", "info" or "question"
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "退出する"
          }
      ).then((result) => {
        if (result.value) {
          return true;
        } else {
          return false;
        }
      });
      if (!rr) {
        return;
      }
      let self = this;
      let res = this.db.doc('rooms/' + this.roomId).update({
        children: self.store.firebase.firestore.FieldValue.arrayRemove(self.store.user.uid),
      }).then(function () {
        return true;
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (res) {
        this.store.messages.push(
            {text: "部屋を退出しました．"}
        );
        await this.$router.push("/rooms");
        return;
      } else {
        this.store.messages.push(
            {text: "部屋の退出に失敗しました．"}
        );
        return;
      }
    }
  }
}
</script>
