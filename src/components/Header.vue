<template>
  <v-app-bar app color="primary" dark class="my-background-main rounded-b-xl d-block">
    <div class="d-flex">
      <!--      <Fa :icon="faHandRock" fw size="2x" class="secondary&#45;&#45;text"/>-->
      <Fa :icon="faHandPeace" fw size="2x" class="secondary--text"/>
      <router-link to="/">
        <h2 class="white--text">{{ msg }}</h2>
      </router-link>
      <Fa :icon="faHandPeace" fw size="2x" class="secondary--text"/>
    </div>
  </v-app-bar>
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
  data() {
    return {
      faHandRock,
      faHandPaper,
      faHandPeace
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