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
      <card-button @click="makeRoom();" msg="部屋を作る" my-class="success ma-2"></card-button>
      <card-button @click="alert(123);" msg="部屋を探す" my-class="secondary ma-2"></card-button>

      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">ルーム設定</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6" class="py-1">
                    <v-text-field label="ルーム名*" required prepend-inner-icon="mdi-home"></v-text-field>
                  </v-col>
                  <v-col cols="4" class="py-1">
                    <v-select
                        :items="capacity"
                        label="募集人数*"
                        required prepend-inner-icon="mdi-account-multiple"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" class="py-1">
                    <div>
                      <v-checkbox v-model="roomSetting.lock" label="鍵をかける" prepend-icon="mdi-lock"></v-checkbox>
                    </div>
                    <div v-if="roomSetting.lock">
                      <v-text-field label="Password*" type="password" required></v-text-field>
                    </div>
                  </v-col>

                  <v-col cols="12" class="py-1">
                    <v-text-field label="ルーム説明"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small>*必須入力項目</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
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

export default {
  name: 'Top',
  components: {
    CardButton,
    Fa
  },
  data() {
    return {
      dialog: false,
      faHandRock,
      faHandPaper,
      faHandPeace,
      time: 0,
      roomSetting: {
        lock: false,
      }
    }
  },
  methods: {
    alert: (msg) => {
      alert(msg)
    },
    makeRoom() {
      if (!this.store.user) {
        this.store.messages.push(
            {
              dismissible: 0,
              time: 2.5,
              risk: 3,
              text: "ユーザが取得できませんでした．リロードしてください．"
            }
        );
        return;
      }
      this.dialog = true;
    }

  },
  computed: {
    capacity: function () {
      let ar = [];
      for (let i = 1; i < 10; i++) {
        ar.push(i);
      }
      console.log(ar);
      return ar;
    }
  }
}
</script>
