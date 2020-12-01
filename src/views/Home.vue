<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/janken2.png">
    <HelloWorld msg="ジャンケン Online"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
