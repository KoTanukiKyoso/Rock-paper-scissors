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
      <card-button @click="alert(123);" msg="部屋を作る" my-class="success ma-2"></card-button>
      <card-button @click="alert(123);" msg="部屋を探す" my-class="secondary ma-2"></card-button>

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
  data: () => ({
    faHandRock,
    faHandPaper,
    faHandPeace,
  }),
  methods: {
    alert: (msg) => {
      alert(msg)
    },
  }
}
</script>
