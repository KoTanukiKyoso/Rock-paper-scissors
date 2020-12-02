<template>
  <v-footer class="footer my-background-main">
    <h3>ジャンケン Online</h3>
    <v-divider></v-divider>
    <ul>
      <li>
        <router-link to="/about">ABOUT</router-link>
      </li>
      |
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank"
             rel="noopener">Getting Started</a></li>
      |
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank"
             rel="noopener">What's "じゃんけん"</a></li>
      |
      <li>
        <router-link to="/about">利用規約</router-link>
      </li>
    </ul>
    © 2020 たぬき Inc.
  </v-footer>
</template>

<script>

export default {
  name: "Footer"
}
</script>

<style scoped lang="scss">
h3 {
  margin: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 5px;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.footer {
  color: white;
  width: calc(100% - 20px);
  padding: 10px;
  position: absolute;
  bottom: 0;
  left: 0;
}

a.router-link-exact-active {
  color: white;
}

a:link, a:visited {
  color: white;
}
</style>