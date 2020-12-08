<template>
  <v-main>
    <v-container class="text-center">
      <v-img
          :src="require('../assets/janken2.png')"
          class="my-3"
          contain
          height="200"
      />

      <Fa :icon="faHandRock" fw size="2x" class="secondary--text"/>
      <Fa :icon="faHandPeace" fw size="2x" class="secondary--text"/>
      <Fa :icon="faHandPaper" fw size="2x" class="secondary--text"/>
      <h1 class="font-weight-bold mb-3">
        ジャンケン Online
      </h1>
      <p>
        オンラインでじゃんけん対戦ができる画期的なサービスです<br>
        ，，，多分
      </p>

      <h2 class="font-weight-bold mb-1 primary--text">
        そうだ，じゃんけんしよう．
      </h2>
      <card-button @click="setRoom();" msg="部屋を作る" my-class="success ma-2"></card-button>
      <router-link to="/rooms">
        <card-button msg="部屋を探す" my-class="secondary ma-2"></card-button>
      </router-link>

      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">ルーム設定</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols=12 class="py-1 col-sm-6">
                    <v-text-field v-model="roomSetting.roomName" label="ルーム名*" required
                                  prepend-inner-icon="mdi-home"></v-text-field>
                  </v-col>
                  <v-col cols=6 class="py-1 col-sm-4">
                    <v-select v-model="roomSetting.numOfChildren"
                              :items="capacity(1,9, 1)"
                              label="募集人数*"
                              required prepend-inner-icon="mdi-account-multiple"
                    ></v-select>
                  </v-col>

                  <v-div>
                    <v-col cols=6 class="py-1 col-sm-4">
                      <v-select v-model="roomSetting.numOfBattle" :items="capacity(1,10, 1)" label="対戦回数*"
                                required prepend-inner-icon="mdi-fencing"></v-select>
                    </v-col>
                  </v-div>

                  <v-row cols="12">
                    <div class="py-0 mx-4 mb-0 d-inline-block">
                      <v-checkbox v-model="roomSetting.lock" label="鍵をかける" prepend-icon="mdi-lock"></v-checkbox>
                    </div>
                    <v-col v-if="roomSetting.lock" cols="12" class="py-0 mt-0 col-sm-6">
                      <v-text-field v-model="roomSetting.password" label="Password*" type="password"
                                    required></v-text-field>
                    </v-col>
                  </v-row>

                  <v-col cols="12" class="py-1">
                    <v-textarea v-model="roomSetting.roomSummary" filled rows="2" label="ルーム説明" auto-grow></v-textarea>
                  </v-col>
                  <small>*必須入力項目</small>

                  <v-expansion-panels flat>
                    <v-expansion-panel class="">
                      <v-expansion-panel-header ripple class="pb-0">ルール詳細設定</v-expansion-panel-header>
                      <v-divider></v-divider>
                      <v-expansion-panel-content>
                        <v-div class="py-2">
                          <v-col cols="12" class="py-0 subtitle-1">使用可能手</v-col>
                          <v-col v-for="(hand, key) of roomSetting.hands" :key="key" cols="4" class="py-0 mb-0 ">
                            <v-checkbox :label="hand.name" v-model="hand.checked"
                                        :style="hand.checked ? {color: store.colors.primary} : {color: 'rgba(0,0,0,0.4)'}"
                                        :prepend-icon="hand.icon"></v-checkbox>
                          </v-col>
                          <v-col cols="12" class="py-0">
                            <v-checkbox v-model="roomSetting.rematchAiko" label="あいこ時は再対戦"
                                        prepend-icon="mdi-not-equal-variant"></v-checkbox>
                          </v-col>
                        </v-div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>

                </v-row>
              </v-container>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" class="font-weight-bold" text @click="dialog = false">キャンセル</v-btn>
              <v-btn color="blue darken-1" class="font-weight-bold" text @click="createRoom">作成</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

    </v-container>
  </v-main>
</template>

<script>
import Fa from 'vue-fa'
import {faHandPaper, faHandRock, faHandPeace} from '@fortawesome/free-solid-svg-icons'
import CardButton from "@/components/parts/cardButton";
import VDiv from "@/components/parts/vDiv";

// let
export default {
  name: 'Top',
  components: {
    VDiv,
    CardButton,
    Fa
  },
  data() {
    return {
      db: null,
      dialog: false,
      faHandRock,
      faHandPaper,
      faHandPeace,
      time: 0,
      roomSettingBase: {
        now: 0,
        results: {},
        children: [],
        recruitment: true,
        timestamp: null,
        owner: null,
        lock: false,
        rematchAiko: false,
        roomName: "name",
        roomSummary: "",
        password: "",
        numOfChildren: 1,
        numOfBattle: 1,
        hands: {
          rock: {
            name: "グー",
            checked: true,
            icon: "fa-hand-rock"
          },
          scissors: {
            name: "チョキ",
            checked: true,
            icon: "fa-hand-peace"
          },
          paper: {
            name: "パー",
            checked: true,
            icon: "fa-hand-paper"
          },
        },
      },
      roomSetting: {}
    }
  },
  created: function () {
    console.log("top created");
    for (let listener of this.store.listeners) {
      listener();
    }
    this.store.listeners = [];
    this.roomSetting = {...this.roomSettingBase};
    this.db = this.store.firebase.firestore();
  },
  methods: {
    alert: (msg) => {
      alert(msg)
    },
    setRoom() {
      if (!this.store.user) {
        this.store.messages.push(
            {
              text: "ユーザが取得できませんでした．cookieを許可してください．繰り返し発生する場合はリロードしてください．"
            }
        );
        return;
      }
      this.dialog = true;
    },
    async createRoom() {
      let setting = this.roomSetting;
      if (setting.lock) {
        if (!setting.password) {
          this.store.messages.push(
              {
                text: "パスワードを入力してください．"
              }
          );
          return;
        }
      }
      if (!setting.roomName) {
        this.store.messages.push({
          text: "ルーム名を入力してください．"
        });
        return;
      }
      if (setting.roomName.length > 24) {
        this.store.messages.push({
          text: "ルーム名は24文字以内で入力してください．"
        });
        return;
      }
      let n = 0;
      for (let key in setting.hands) {
        let hand = setting.hands[key];
        if (hand.checked) {
          n++;
        }
      }
      if (n < 2) {
        this.store.messages.push(
            {
              text: "使用可能手は2つ以上必要です．"
            }
        );
        return;
      }

      setting.owner = this.store.user.uid;
      setting.timestamp = this.store.firebase.firestore.FieldValue.serverTimestamp();
      //部屋を登録
      let res = await this.db.collection("rooms").add(setting).then(function (ref) {
        return {ref: ref};
      }).catch(function (err) {
        console.log(err);
        return false;
      });
      if (!res) {
        this.store.messages.push({
          text: "ルームの作成に失敗しました．再度作成してください．"
        });
        return;
      }
      this.store.messages.push({
        text: "ルームを作成しました．"
      });
      this.dialog = false;
      this.roomSetting = {...this.roomSettingBase};
      // console.log(res.ref);
      this.$router.push("/battleRoom?id=" + res.ref.id);
    }
  },
  computed: {
    capacity: function () {
      return function (s, e, p = 1) {
        let ar = [];
        for (let i = s; i <= e; i += p) {
          ar.push(i);
        }
        return ar;
      }
    },
  }
}
</script>
