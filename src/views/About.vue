<template class="primary">
  <v-main class="primary lighten-1">
    <v-container class="about d-flex flex-column pa-0" style="align-items: stretch; height: 100%;">
      <div>
        <v-row class="py-1 px-4 white--text">
          <v-col cols="4">
            <router-link to="/" class="white--text">
              <Fa :icon="faArrowLeft" fw size="lg"/>
            </router-link>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="" align="end" cols="4">
            ABOUT
          </v-col>
        </v-row>
      </div>
      <div class="rounded-t-xl white pa-6 elevation-10 flex-fill">
        <h2 class="font-weight-bold mb-0 primary--text ">
          本システムについて
        </h2>
        <v-divider></v-divider>
        <h2 class="mb-2 secondary--text font-weight-regular">ABOUT</h2>
        <p>
          オンラインでじゃんけん対戦ができる画期的なサービスです<br>
          ，，，多分
        </p>
      </div>
    </v-container>
  </v-main>
</template>


<script>
import Fa from 'vue-fa'
import {faArrowLeft, faHandRock, faHandPeace} from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'Top',
  components: {
    Fa
  },
  data: () => ({
    faHandRock,
    faArrowLeft,
    faHandPeace,
  }),
  methods: {
    alert: (msg) => {
      alert(msg)
    },
  }
}
</script>
