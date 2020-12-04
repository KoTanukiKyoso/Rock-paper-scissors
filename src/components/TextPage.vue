<template>
  <v-main class="primary lighten-1">
    <v-container class="d-flex flex-column pa-0" style="align-items: stretch; height: 100%;">
      <div>
        <v-row class="py-1 px-4 white--text">
          <v-col cols="4">
            <router-link to="/" class="white--text">
              <Fa :icon="faArrowLeft" fw size="lg"/>
            </router-link>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="" align="end" cols="4">
            {{title.main}}
          </v-col>
        </v-row>
      </div>
      <div class="rounded-t-xl white pa-6 elevation-10 flex-fill">
        <h2 class="font-weight-bold mb-0 primary--text ">
          {{title.sub}}
        </h2>
        <v-divider></v-divider>
        <h2 class="mb-2 secondary--text font-weight-regular">{{title.main}}</h2>
        <div v-for="(content, index) of contents" :key="index" class="ma-md-3 my-md-3 my-2" style="color: #4c4e40;">
          <div class="font-weight-bold secondary--text text--darken-2">{{ content.title }}</div>
          <div v-if="content.text">
            <div v-for="(line, i) of content.text.split(/\r?\n/g)" :key="i" v-html="line"></div>
          </div>
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script>

import Fa from "vue-fa";
import {faArrowLeft, faHandRock, faHandPeace} from '@fortawesome/free-solid-svg-icons'

export default {
  name: "TextPage",
  components: {
    Fa
  },
  props: {
    contents: Array,
    title: Object
  },
  data: () => ({
    faHandRock,
    faArrowLeft,
    faHandPeace,
  }),
}
</script>

<style scoped lang="scss">
</style>