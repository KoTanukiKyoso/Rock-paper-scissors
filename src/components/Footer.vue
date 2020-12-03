<template>
  <v-footer color="primary" class="white--text">
    <v-col class="pa-1 text-center">
      <h3 class="d-block ma-0 accent--text">ジャンケン Online</h3>

      <v-btn v-for="link of links" :key="link.text" rounded text color="white">
        <router-link :to="link.link">{{link.text}}</router-link>
      </v-btn>
      <v-divider></v-divider>
      <div class="pt-2">© 2020 たぬき Inc.</div>
    </v-col>
  </v-footer>
</template>

<script>

export default {
  name: "Footer",
  data: () => ({
    links: [
      {
        text: "ABOUT",
        type: "1",
        link: "/about"
      },
      {
        text: "Getting Started",
        type: "1",
        link: "/getstart"
      },
      {
        text: "What's \"じゃんけん\"",
        type: "1",
        link: "/whats"
      },
      {
        text: "利用規約",
        type: "1",
        link: "/terms"
      },
    ],
  }),
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
  width: 100%;
  padding: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
}

a.router-link-exact-active {
  color: white;
  text-decoration: none
}

a:link, a:visited {
  color: white;
  text-decoration: none
}
</style>