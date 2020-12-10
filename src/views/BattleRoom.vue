<template>
  <v-main>
    <v-container v-if="Object.keys(room).length > 0">
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
      <!--state display-->
      <v-row class="px-2">
        <div class="d-inline-block pr-5">
          参加人数：
          <span class="font-weight-bold primary--text">
            {{ room.children.length }}/{{ room.numOfChildren }}
          </span>
        </div>
        <div class="d-inline-block pr-5">
          状態：
          <span v-if="room.recruitment" class="font-weight-bold primary--text">
            参加者募集中
          </span>
          <span v-else class="font-weight-bold primary--text">
            参加締め切り
          </span>
        </div>
        <v-spacer></v-spacer>
        <div v-if="room.now" class="d-inline-block pr-2">
          第 <span class=" font-weight-bold primary--text">{{ room.now }} / {{ room.numOfBattle }}</span> 回戦
        </div>
      </v-row>

      <div v-if="isOwner" class="ma-4">
        <v-row>
          <h3>あなたが親です</h3>
          <v-col cols="12">
            <v-btn v-if="room.recruitment" @click="closeRecruit" x-large color="primary">募集を締め切る</v-btn>
            <v-btn v-else-if="room.now < room.numOfBattle" @click="goToNextBattle" x-large color="primary">
              次のじゃんけんに進む
            </v-btn>
            <v-btn v-else-if="room.now >= room.numOfBattle" @click="closeRoom" x-large color="primary">対戦を終了する
            </v-btn>
            <v-btn v-if="isAiko" @click="aikoRematch" x-large color="secondary ml-2">あいこでしょ</v-btn>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <h3 v-if="room.recruitment" class="d-block py-3">親の開始を待っています...</h3>
        <v-row justify="center">
          <v-col cols="3"></v-col>
          <v-col cols="6">
            <h2>親の手</h2>
          </v-col>
          <v-col cols="3"></v-col>
          <transition>
            <template v-if="room.results && room.results[room.now] && room.results[room.now][room.owner]
          && room.results[room.now][store.user.uid]">
              <template v-for="(hand, key) of hands">
                <v-col v-if="room.results[room.now][room.owner].hand == key" cols="6" :key="key"
                       align-self="center" v-ripple class="pa-0 col-md-4">
                  <v-card style="text-align: center; border-style: solid; border-width: 4px;" shaped elevation="5"
                          :style="{borderColor: hand.color, color: hand.color}" class="py-10" :class="{
                        'display-3': $vuetify.breakpoint.smAndDown, 'display-4': $vuetify.breakpoint.mdAndUp}">
                    <v-icon style="font-size: inherit; color: inherit;">{{ hand.icon }}</v-icon>
                  </v-card>
                </v-col>
              </template>
            </template>
            <v-col v-else cols="6" class="pa-0 col-md-4">
              <v-card style="text-align: center; border: solid 10px white;" shaped v-ripple elevation="5"
                      class="py-10 blue-gradation mx-auto" :class="{
                'display-3': $vuetify.breakpoint.smAndDown,
                'display-4': $vuetify.breakpoint.mdAndUp}">
                <v-icon style="font-size: inherit; color: inherit;"></v-icon>
              </v-card>
            </v-col>
          </transition>
        </v-row>
      </div>
      <v-row class="mt-3">
        <!--じゃんけんぽんアニメ-->
        <v-col v-if="room.ofNow == 0" cols="12" style="position: relative;" class="my-3 mx-auto">
          <template v-for="(word, i) of animations.rsp.words">
            <transition :key="i" :name="animations.rsp.animationType" mode="out-in"
                        @after-enter="nextAnime(animations.rsp)">
              <h1 v-if="animations.rsp.animation == i"
                  style="position: absolute; top: 0; text-align: center; right: 0; left: 0;"
                  class="mx-auto" :class="word.class">
                {{ word.text }}
              </h1>
            </transition>
          </template>
        </v-col>
        <v-col v-else-if="isAikoUser" cols="12" style="position: relative;" class="my-3 mx-auto">
          <h1 style="position: absolute; top: 0; text-align: center; right: 0; left: 0;"
              class="mx-auto">あいこで しょ！</h1>
        </v-col>
        <!--出す 手-->
        <transition>
          <v-col cols="12" v-if="isEndAnimation(animations.rsp) || isAikoUser" class="pa-0">
            <v-row justify="center" class="px-2 mx-auto" style="max-width: 1000px;">
              <v-col @click="selectHand(key)" v-for="(hand, key) of hands" :key="key" v-ripple class="px-1 px-md-2">
                <v-card style="text-align: center; border-style: solid; border-width: 4px;" shaped elevation="5"
                        :style="handCheck(key) ? {borderColor: hand.color, color: hand.color} : {borderColor: '#999', color: '#999'}"
                        class="py-10 pointer"
                        :class="{ 'display-3': $vuetify.breakpoint.smAndDown, 'display-4': $vuetify.breakpoint.mdAndUp }">
                  <v-icon style="font-size: inherit; color: inherit;">{{ hand.icon }}</v-icon>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </transition>
      </v-row>

      <!--チャット-->
      <v-row class="mt-3">
        <v-col cols="12" class="col-md-6">
          <v-card class="mx-5 mx-auto" style="min-height: 300px;" elevation="2">
            <v-card-title class="font-weight-bold pb-1">じゃんけん結果</v-card-title>
            <v-divider/>
            <div class="px-3 py-1 grey lighten-3" style="height: 300px; overflow-y: auto;">
              <v-card class="my-1">

              </v-card>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" class="col-md-6">
          <v-card class="mx-5 mx-auto" style="min-height: 300px;" elevation="2">
            <v-card-title class="font-weight-bold pb-1">チャット</v-card-title>
            <v-divider/>
            <div id="chatContainer" class="pa-1 pt-0 grey lighten-3" style="height: 300px; overflow-y: auto;">
              <v-card v-for="message of messages" :key="message.key" class="pt-1 mt-1">
                <v-card-title class="py-1">
                  <template v-if="store.user.uid == message.uid">
                    <v-avatar color="primary" size="30">
                      <span class="white--text subtitle-2">自</span>
                    </v-avatar>
                    <span class="px-2 subtitle-1 font-weight-bold">あなた</span>
                  </template>
                  <template v-else-if="room.owner == message.uid">
                    <v-avatar color="secondary" size="30">
                      <span class="white--text subtitle-2">親</span>
                    </v-avatar>
                    <span class="px-2 subtitle-1 font-weight-bold">オーナー</span>
                  </template>
                  <template v-else>
                    <v-avatar color="indigo" size="30">
                      <span class="white--text subtitle-2">{{ message.shortName }}</span>
                    </v-avatar>
                    <span class="px-2 subtitle-1">{{ message.name }}</span>
                  </template>
                  <v-spacer/>
                  <small style="text-align: end; font-size: 12px; color: #999;">{{timestampToTime(message.timestamp.seconds) }}</small>
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
    now: 0,
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
    room: {},
    roomId: "",
    isOwner: false,
    onetime: true,
    show1: false,
    rules: {
      required: value => !!value || '必須入力.',
      // min: v => v.length >= 8 || 'Min 8 characters',
      // emailMatch: () => ('The email and password you entered don\'t match'),
    },
    chatText: "",
    messages: [],
    animations: {
      rsp: {
        span: 1000,
        animationType: "fromLeftToRight",
        animation: -1,
        words: [
          {
            text: "最初はグー",
            class: ""
          },
          {
            text: "じゃん ・ けん",
            class: ""
          },
          {
            text: "ポン！！",
            class: "primary--text display-1 font-weight-bold"
          }
        ]
      }
    },
    results: [],
  }),
  created: function () {
    console.log("created battle room");
    for (let listener of this.store.listeners) {
      listener();
    }
    this.store.listeners = [];
    this.room = {};
    this.messages = [];
    for (let key in this.animations) {
      let anime = this.animations[key];
      anime.animation = -1;
    }
    this.onetime = true;
    this.db = this.store.firebase.firestore();
    this.intoRoom();
  },
  computed: {
    isEndAnimation: function () {
      return function (anime) {
        console.log("isEndAnimation");
        if (anime.words.length - 1 <= anime.animation) {
          return true;
        }
        return false;
      }
    },
    handCheck: function () {
      return function (hand) {
        console.log("handCheck");
        if (!this.room.hands[hand].checked) {
          return false;
        }
        if (this.room.now < 0) {
          return true;
        }
        if (!this.room.results) {
          return true;
        }
        if (!this.room.results[this.room.now]) {
          return true;
        }
        if (this.room.results[this.room.now][this.store.user.uid]) {
          if (this.room.results[this.room.now][this.store.user.uid].hand == hand) {
            return true;
          }
          return false;
        }
        return true;
      }
    },
    isAiko: function () {
      console.log("isAiko");
      let result = this.room.results[this.room.now];
      //まだ手を出していない
      if (!result || !result[this.store.user.uid]) {
        return false;
      }
      //あいこ後再戦しない
      if (!this.room.rematchAiko) {
        return false;
      }
      for (let key in result) {
        let res = result[key];
        if (res && this.room && this.room.ofNow == res.ofNow &&
            res.hand == result[this.store.user.uid].hand && key != this.room.owner) {
          return true;
        }
      }
      return false;
    },
    isAikoUser: function () {
      console.log("isAikoUser");
      let results = this.getResults();
      //あいこユーザの条件
      //自分のじゃんけんデータがnullである
      if (this.room && results && results[this.store.user.uid] === null) {
        return true;
      }
      //自分のデータのofNowが最新
      if (this.getMyResult() && this.getMyResult().ofNow == this.room.ofNow) {
        return true;
      }
      return false;
    },
  },
  methods: {
    timestampToTime(timestamp) {
      const date = new Date(timestamp * 1000);
      const yyyy = `${date.getFullYear()}`;
      const MM = `0${date.getMonth() + 1}`.slice(-2);
      const dd = `0${date.getDate()}`.slice(-2);
      const HH = `0${date.getHours()}`.slice(-2);
      const mm = `0${date.getMinutes()}`.slice(-2);
      const ss = `0${date.getSeconds()}`.slice(-2);
      return `${yyyy}/${MM}/${dd} ${HH}:${mm}:${ss}`;
    },
    getResults() {
      if (!this.room.results[this.room.now]) {
        return false;
      }
      return {...this.room.results[this.room.now]};
    },
    getMyResult() {
      if (!this.getResults() || !this.getResults()[this.store.user.uid]) {
        return false;
      }
      return this.getResults()[this.store.user.uid];
    },
    getOwnerHand() {
      return this.getResults()[this.room.owner].hand;
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
    nextAnime(anime) {
      console.log("nextAnime");
      setTimeout(() => {
        if (anime.animation < anime.words.length - 1) {
          anime.animation++;
        }
      }, anime.span);
    },
    async intoRoom() {
      console.log("intoRoom");
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
      let listener = await this.db.collection("rooms").doc(gets.id)
          .onSnapshot(function (doc) {
            console.log("battle room changed");
            if (!doc.exists) {
              self.store.messages.push(
                  {text: "オーナーによって解散されました．"}
              );
              self.$router.push("/rooms");
              return;
            }
            self.room = doc.data();
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
      this.store.listeners.push(listener);
    },
    async checkRoom() {
      console.log("checkRoom");
      if (!this.room) {
        this.store.messages.push(
            {text: "部屋が存在しないか削除済みです．"}
        );
        await this.$router.push("/rooms");
        return;
      }

      //既入室確認
      if (this.room.owner == this.store.user.uid) {
        this.isOwner = true;
      } else if (this.room.children.includes(this.store.user.uid)) {
        console.log("");
      } else {
        //入室してない場合空きがあって鍵部屋でなければ入室
        if (this.room.lock || this.room.children.length >= this.room.numOfChildren) {
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
      }

      //チャット取得処理
      this.listenMessage();
      //結果取得
      this.listenResults();
    },
    listenMessage() {
      console.log("listenMessage");
      let self = this;
      let listener = this.db.collection("messages").where("room", "==", this.roomId)
          .orderBy("timestamp", "desc").limit(100)
          .onSnapshot(function (querySnapshot) {
            console.log("messages changed");
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
      this.store.listeners.push(listener);
    },
    listenResults() {
      console.log("listen results");
      let self = this;
      let listener = this.db.collection("results").where("room", "==", this.roomId)
          .orderBy("timestamp", "desc").limit(100)
          .onSnapshot(function (querySnapshot) {
            console.log("results changed");
            let results = [];
            querySnapshot.forEach(function (doc) {
              let data = doc.data();
              data.key = doc.id;
              results.unshift(data);
            });
            self.results = results;
          });
      this.store.listeners.push(listener);
    },
    async onChangeRoomState() {
      console.log("onChangeRoomState");
      if (this.now != this.room.now) {
        this.now = this.room.now;
        this.$nextTick(() => {
          console.log("go animation");
          this.animations.rsp.animation = 0;
        });
      }
    },
    async selectHand(hand) {
      console.log("selectHand");
      if (this.room.now < 0) {
        return;
      }
      if (this.room.results[this.room.now] && this.room.results[this.room.now][this.store.user.uid]) {
        return;
      }
      if (!this.handCheck(hand)) {
        return;
      }
      let arr = {};
      arr[this.room.now] = {};
      arr[this.room.now][this.store.user.uid] = {
        hand: hand,
        owner: "",
        ofNow: this.room.ofNow,
        done: false
      };
      let res = this.db.doc('rooms/' + this.roomId).set({
        results: arr,
      }, {merge: true}).then(function () {
        return true;
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (!res) {
        this.store.messages.push({text: "手の送信に失敗しました．"});
        return;
      }
    },
    aikoRematch() {
      console.log("aikoRematch");
      let ownerHand = this.getOwnerHand();
      let rr = this.getResults();

      let batch = this.db.batch();

      //ofNow更新
      let nycRef = this.db.collection("rooms").doc(this.roomId);
      batch.update(nycRef, {ofNow: this.room.ofNow + 1});

      for (let key in rr) {
        let result = rr[key];
        let arr = {};
        arr[this.room.now] = {};
        //今試合あいこなら
        if (result.ofNow == this.room.ofNow && result.hand == rr[this.room.owner].hand) {
          //あいこ用にあいこ者の現データ破棄
          arr[this.room.now][key] = null;
          batch.set(nycRef, {results: arr}, {merge: true});
        } else if (!result.done) {
          //あいこ者以外の結果の確定
          arr[this.room.now][key] = {};
          arr[this.room.now][key].done = true;
          arr[this.room.now][key].owner = ownerHand;
          batch.set(nycRef, {results: arr}, {merge: true});
        }
      }

      batch.commit().then(function () {
        console.log("success");
      }).catch(function (err) {
        console.log(err);
        return false;
      });
    },
    async saveResult() {//その回の結果を保存
      if (!this.isOwner) {
        return;
      }

      let batch = this.db.batch();
      let rr = this.room.results[this.room.now];
      let ref = this.db.collection("results");
      if (this.room.rematchAiko) {
        //あいこ時再対戦，最後のあいこは埋めて送信
        for (let key in rr) {
          if (key != this.room.owner) {
            let doc = ref.doc();
            let result = rr[key];
            let arr = {
              time: this.room.now,
              room: this.roomId,
              owner: this.store.user.uid,
              ownerName: "owner",
              ownerHand: result.owner,
              uid: key,
              userName: "user",
              userHand: result.hand,
              ofNow: result.ofNow,
              timestamp: this.store.firebase.firestore.FieldValue.serverTimestamp(),
            };
            if (!result.owner && !result.done && result.ofNow == this.room.ofNow) {//結果未保存
              arr.ownerHand = this.getOwnerHand();
              batch.set(doc, arr);
            } else if (result.done) {
              batch.set(doc, arr);
            }
          }
        }
      } else {
        //すべてそのまま補完して送信
        for (let key in rr) {
          if (key != this.room.owner) {
            let doc = ref.doc();
            let result = rr[key];
            let arr = {
              time: this.room.now,
              room: this.roomId,
              owner: this.store.user.uid,
              ownerName: "owner",
              ownerHand: this.getOwnerHand(),
              uid: key,
              userName: "user",
              userHand: result.hand,
              ofNow: 0,
              timestamp: this.store.firebase.firestore.FieldValue.serverTimestamp(),
            };
            batch.set(doc, arr);
          }
        }
      }
      await batch.commit().then(function () {
        console.log("success");
      }).catch(function (err) {
        console.log(err);
        return false;
      });
    },
    async goToNextBattle() {
      console.log("goToNextBattle");
      if (!this.isOwner) {
        return;
      }
      await this.saveResult();

      let res = await this.db.doc('rooms/' + this.roomId).update({
        ofNow: 0,
      }).then(function () {
        return true;
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (!res) {
        this.store.messages.push({text: "次のじゃんけんに進めませんでした．"});
        return;
      }

      res = this.db.doc('rooms/' + this.roomId).update({
        now: this.room.now + 1,
      }).then(function () {
        return true;
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (!res) {
        this.store.messages.push({text: "次のじゃんけんに進めませんでした．"});
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
        name: this.store.user.displayName || "名無し",//this.store.user.uid.substr(0, 2)
        shortName: (this.store.user.displayName || "名無し").substr(0, 2),
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
    async closeRoom() {
      console.log("closeRoom");
      if (this.room.owner != this.store.user.uid) {
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

      //チャットの削除
      let batch = this.db.batch();
      await (async () => {
        const snapshots = await this.db.collection("messages").where("room", "==", this.roomId).get();
        await snapshots.docs.map((doc, index) => {
          if ((index + 1) % 500 === 0) {
            batch.commit();
            batch = this.db.batch();
          }
          batch.delete(doc.ref);
        });
        await batch.commit();
      })();

      await this.saveResult();

      //部屋の削除
      let res = this.db.doc('rooms/' + this.roomId).delete().then(function () {
        return true;
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (!res) {
        this.store.messages.push(
            {text: "部屋の解散に失敗しました．"}
        );
        return;
      }
    },
    async exitRoom() {
      console.log("exitRoom");
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
    },
    closeRecruit() {
      if (this.room.children.length == 0) {
        this.store.messages.push({text: "対戦相手が0の状態で募集締め切りは出来ません．"});
        return;
      }

      let res = this.db.doc('rooms/' + this.roomId).update({
        recruitment: false,
      }).then(function () {
        return true;
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (!res) {
        this.store.messages.push({text: "募集の締め切りに失敗しました．"});
        return;
      }

      res = this.db.doc('rooms/' + this.roomId).update({
        now: 1,
      }).then(function () {
        return true;
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (!res) {
        this.store.messages.push({text: "じゃんけんの開始に失敗しました．"});
        return;
      }
    }
  }
}
</script>
