<template>
  <v-main>
    <v-container>
      <router-link to="/">
        <Fa :icon="faArrowLeft" fw size="lg"/>
      </router-link>
      <div v-if="Object.keys(rooms).length == 0" class="pa-4">
        <h3>ルームがありません．<br>自身でルームを作成する場合は「部屋を作る」を選択してください．</h3>
        <v-btn text rounded>
          <router-link to="/">
            <h2>戻る</h2>
          </router-link>
        </v-btn>
      </div>
      <v-row>
        <v-col v-for="(room, key) of rooms" :key="key" cols="6" class="col-md-4">
          <v-card @click="intoRoom(room, key)" style="border-top-width: 4px; border-top-style: solid;"
                  :style="
                      room.owner == store.user.uid ? {borderTopColor: store.colors.secondary} :
                      room.children.includes(store.user.uid) ? {borderTopColor: store.colors.info} :
                      room.children.length >= room.numOfChildren ? {borderTopColor: store.colors.error} :
                      {borderTopColor: store.colors.success}
                      ">
            <div style="text-align: end;" class="pr-2 font-weight-bold subtitle-2 primary--text ">
              <span v-if="room.owner == store.user.uid">オーナー</span>
              <span v-else-if="room.children.includes(store.user.uid)">参加中</span>
              <span v-else-if="room.children.length >= room.numOfChildren">参加不可</span>
              <span v-else style="opacity: 0;">a</span>
            </div>
            <v-card-title class="pb-1 pt-0">
              <v-icon v-if="room.lock">mdi-lock</v-icon>
              {{ room.roomName }}
            </v-card-title>
            <div align="start" class="px-4 py-0 my-0 ">
              <div class="d-inline-block pr-3">
                <v-icon>mdi-account-multiple</v-icon>
                {{ room.children.length }} / {{ room.numOfChildren }}
              </div>
              <div class="d-inline-block pr-3">
                <v-icon>mdi-fencing</v-icon>
                {{ room.numOfBattle }}
              </div>
              <div class="d-inline-block">
                <span v-if="room.rematchAiko">あいこ再戦</span>
                <span v-else>あいこ引分</span>
              </div>
            </div>
            <v-card-text v-if="room.roomSummary">
              {{ room.roomSummary }}
            </v-card-text>
            <v-card-text v-else>詳細は登録されておりません</v-card-text>
            <v-card-actions class="pa-3">
              <v-icon class="mx-2" :style="room.hands.rock.checked ? {color: store.colors.primary} : {}">
                fas fa-hand-rock
              </v-icon>
              <v-icon class="mx-2" :style="room.hands.scissors.checked ? {color: store.colors.primary} : {}">fas
                fa-hand-peace
              </v-icon>
              <v-icon class="mx-2" :style="room.hands.paper.checked ? {color: store.colors.primary} : {}">fas
                fa-hand-paper
              </v-icon>
            </v-card-actions>
            <div style="text-align: end;">
              <small class="px-4 pb-2">
                {{ timestampToTime(room.timestamp.seconds) }}
              </small>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">パスワードを入力してください</span>
          </v-card-title>
          <v-card-actions class="px-5">
            <v-text-field v-model="password"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required]"
                          :type="show1 ? 'text' : 'password'" label="パスワード" hint="空欄にはできません" counter
                          @click:append="show1 = !show1" class="mx-auto"
            ></v-text-field>
          </v-card-actions>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" class="font-weight-bold" text @click="dialog = false">キャンセル</v-btn>
            <v-btn color="blue darken-1" class="font-weight-bold" text @click="checkPass()">完了</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script>
import Fa from "vue-fa";
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

export default {
  name: 'rooms',
  components: {
    Fa
  },
  data: () => ({
    faArrowLeft,
    rooms: {},
    db: null,
    passwordCheck: false,
    dialog: false,
    password: "",
    show1: false,
    selectedRoom: null,
    rules: {
      required: value => !!value || 'Required.',
      // min: v => v.length >= 8 || 'Min 8 characters',
      // emailMatch: () => ('The email and password you entered don\'t match'),
    },
  }),
  created() {
    console.log("created rooms");
    for (let listener of this.store.listeners) {
      listener();
    }
    this.store.listeners = [];
    this.db = this.store.firebase.firestore();
    this.password = "";
    this.listenRoom();
  },
  methods: {
    listenRoom() {
      let self = this;
      let listener = this.db.collection("rooms").orderBy("timestamp", "desc").limit(50)
          .onSnapshot(function (querySnapshot) {
            console.log("changed rooms");
            let rooms = {};
            querySnapshot.forEach(function (doc) {
              let room = doc.data();
              if (room.recruitment || (room.owner == self.store.user.uid || room.children.includes(self.store.user.uid))) {
                rooms[doc.id] = room;
              }
            });
            self.rooms = rooms;
          });
      this.store.listeners.push(listener);
    },
    async intoRoom(room, key) {
      //自分がオーナーなら
      if (room.owner == this.store.user.uid) {
        await this.$router.push("/battleRoom?id=" + key);
        return;
      }
      //既に参加済みなら
      if (room.children.includes(this.store.user.uid)) {
        await this.$router.push("/battleRoom?id=" + key);
        return;
      }

      //人数チェック
      if (room.children.length >= room.numOfChildren) {
        this.store.messages.push(
            {text: "その部屋は既に人数がいっぱいです．"}
        );
        return;
      }

      //パスワードチェック
      if (room.lock) {
        this.selectedRoom = room;
        this.selectedRoom.key = key;
        this.dialog = true;
        return;
      }

      let self = this;
      //登録
      let res = this.db.doc('rooms/' + key).update({
        children: self.store.firebase.firestore.FieldValue.arrayUnion(self.store.user.uid),
      }).then(function () {
        return true;
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (res) {
        await this.$router.push("/battleRoom?id=" + key);
        return;
      } else {
        this.store.messages.push({text: "入室に失敗しました．通信が混雑している可能性があります．"});
      }
    },
    async checkPass() {
      if (this.password === "") {
        return;
      }

      let room = this.selectedRoom;
      let key = this.selectedRoom.key;

      //人数チェック
      if (room.children.length >= room.numOfChildren) {
        this.store.messages.push(
            {text: "その部屋は既に人数がいっぱいです．"}
        );
        return;
      }

      //パスワードチェック
      if (this.password != room.password) {
        this.store.messages.push(
            {text: "パスワードが違います．"}
        );
        return;
      }

      let self = this;
      //登録
      let res = this.db.doc('rooms/' + key).update({
        children: self.store.firebase.firestore.FieldValue.arrayUnion(self.store.user.uid),
      }).then(function () {
        return true;
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (res) {
        await this.$router.push("/battleRoom?id=" + key);
        return;
      } else {
        this.store.messages.push({text: "入室に失敗しました．通信が混雑している可能性があります．"});
      }
    },
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
  }
}
</script>
