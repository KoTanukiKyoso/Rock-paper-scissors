<template>
  <v-app>
    <Header msg="ジャンケン Online"></Header>

    <v-main>
      <router-view/>
    </v-main>
    <div>
      <Footer></Footer>
    </div>
  </v-app>
</template>

<script>

import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default {
  name: 'App',

  components: {
    Header,
    Footer
  },

  data: () => ({
    //
  }),
};
</script>
