<style>
.v-enter-active, .v-leave-active {
  transition: opacity .5s;
}

.v-enter, .v-leave-to {
  opacity: 0;
}

/*横方向*/
.fromLeft-leave-active,
.fromLeft-enter-active {
  /* transition: opacity 1s; */
  transition: all 0.5s;
}

.fromLeft-enter {
  opacity: 0;
  transform: translateX(-400px);
}

.fromLeft-enter-to {
  opacity: 1;
}

.fromLeft-leave {
  opacity: 1;
}

.fromLeft-leave-to {
  opacity: 0;
  transform: translateX(-400px);
}
</style>
<template>
  <v-app>
    <Header msg="ジャンケン Online"/>

    <transition name="fromLeft" mode="out-in">
      <router-view/>
    </transition>

    <div elevation="10" class="elevation-5">
      <Footer/>
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
